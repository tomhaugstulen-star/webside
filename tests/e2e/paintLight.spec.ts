import { expect, test } from '@playwright/test'

test('edits a copy of an image with history, crop and project save', async ({ page }) => {
  await page.goto('/')
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 120
    const context = canvas.getContext('2d')!
    context.fillStyle = '#4488cc'
    context.fillRect(0, 0, 160, 120)
    return canvas.toDataURL('image/png').split(',')[1]
  })
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.locator('.image-import-control input[type="file"]').setInputFiles({
    name: 'original.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
  })
  const images = page.locator('.canvas-element--image')
  await expect(images).toHaveCount(1)
  await page.getByRole('button', { name: 'Rediger bilde' }).click()
  const dialog = page.getByRole('dialog', { name: 'Rediger bilde' })
  await expect(dialog).toBeVisible()
  const canvas = dialog.getByLabel('Bildearbeidsflate')
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) => node.width)).toBe(160)

  await dialog.getByRole('button', { name: 'Pensel' }).click()
  const bounds = await canvas.boundingBox()
  if (!bounds) throw new Error('Image canvas is unavailable')
  await page.mouse.move(bounds.x + 20, bounds.y + 20)
  await page.mouse.down()
  await page.mouse.move(bounds.x + 55, bounds.y + 20, { steps: 4 })
  await page.mouse.up()
  const readPixel = () => canvas.evaluate((node: HTMLCanvasElement) =>
    [...node.getContext('2d')!.getImageData(35, 20, 1, 1).data])
  const painted = await readPixel()
  await dialog.getByRole('button', { name: 'Angre' }).click()
  await expect.poll(readPixel).not.toEqual(painted)
  await dialog.getByRole('button', { name: 'Gjør om' }).click()
  await expect.poll(readPixel).toEqual(painted)

  await dialog.getByRole('button', { name: 'Marker / flytt' }).click()
  await page.mouse.move(bounds.x + 5, bounds.y + 5)
  await page.mouse.down()
  await page.mouse.move(bounds.x + 85, bounds.y + 65, { steps: 5 })
  await page.mouse.up()
  await dialog.getByRole('button', { name: 'Beskjær' }).click()
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) =>
    [node.width, node.height])).toEqual([80, 60])
  await dialog.getByRole('button', { name: 'Angre' }).click()
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) =>
    [node.width, node.height])).toEqual([160, 120])

  await dialog.getByRole('button', { name: /Hero 16:9/ }).click()
  await expect(dialog.getByLabel('Bredde')).toHaveValue('1920')
  await expect(dialog.getByLabel('Høyde')).toHaveValue('1080')
  await dialog.getByLabel('Bredde').fill('80')
  await dialog.getByLabel('Høyde').fill('60')
  await dialog.getByRole('button', { name: 'Endre størrelse' }).click()
  await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) =>
    [node.width, node.height])).toEqual([80, 60])
  await dialog.getByRole('button', { name: 'Angre' }).click()

  await page.evaluate(() => {
    Object.defineProperty(window, 'showSaveFilePicker', {
      configurable: true,
      value: async () => ({
        createWritable: async () => ({
          write: async (file: File) => {
            if (file.type !== 'image/png') throw new Error('Wrong format')
          },
          close: async () => undefined,
          abort: async () => undefined,
        }),
      }),
    })
  })
  await dialog.getByRole('button', { name: 'Eksporter til fil…' }).click()
  await expect(dialog).toContainText('Bildefilen er lagret i valgt mappe.')

  await dialog.getByRole('button', { name: 'Lagre som nytt bilde på siden' }).click()
  await expect(images).toHaveCount(2)
  await expect(dialog).toBeHidden()
  await page.waitForTimeout(900)
  await page.reload()
  await expect(images).toHaveCount(2)
})
