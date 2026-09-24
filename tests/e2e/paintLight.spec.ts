import { expect, test } from '@playwright/test'

test('imports a movable image, merges with undo, and expands the editor', async ({ page }) => {
  await page.goto('/')
  const files = await page.evaluate(() => {
    const make = (color: string, width: number, height: number) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')!
      context.fillStyle = color
      context.fillRect(0, 0, width, height)
      return canvas.toDataURL('image/png').split(',')[1]
    }
    return { base: make('#4488cc', 160, 120), extra: make('#ff0000', 40, 30) }
  })
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.locator('.image-import-control:has(.element-card--image) input[type="file"]').setInputFiles({
    name: 'base.png', mimeType: 'image/png', buffer: Buffer.from(files.base, 'base64'),
  })
  await page.getByRole('button', { name: 'Rediger bilde' }).click()
  const dialog = page.getByRole('dialog', { name: 'Rediger bilde' })
  await dialog.getByRole('button', { name: 'Fullskjerm' }).click()
  await expect(dialog).toHaveClass(/paint-dialog--fullscreen/)
  await dialog.getByRole('button', { name: 'Avslutt fullskjerm' }).click()
  await expect(dialog).not.toHaveClass(/paint-dialog--fullscreen/)

  const canvas = dialog.getByLabel('Bildearbeidsflate')
  const pixel = () => canvas.evaluate((node: HTMLCanvasElement) =>
    [...node.getContext('2d')!.getImageData(110, 80, 1, 1).data])
  const before = await pixel()
  await dialog.getByLabel('Velg bilde til lerret').setInputFiles({
    name: 'extra.png', mimeType: 'image/png', buffer: Buffer.from(files.extra, 'base64'),
  })
  await expect(dialog.getByRole('button', { name: 'Slå sammen' })).toBeVisible()
  const overlay = dialog.getByLabel('Flytt importert bilde')
  const bounds = await overlay.boundingBox()
  if (!bounds) throw new Error('Import overlay is unavailable')
  const fromX = bounds.x + bounds.width * 80 / 160
  const fromY = bounds.y + bounds.height * 60 / 120
  await page.mouse.move(fromX, fromY)
  await page.mouse.down()
  await page.mouse.move(fromX + bounds.width * 30 / 160,
    fromY + bounds.height * 20 / 120, { steps: 4 })
  await page.mouse.up()
  expect(await pixel()).toEqual(before)
  await dialog.getByRole('button', { name: 'Slå sammen' }).click()
  await expect.poll(pixel).not.toEqual(before)
  await dialog.getByRole('button', { name: 'Angre' }).click()
  await expect.poll(pixel).toEqual(before)
  await dialog.getByRole('button', { name: 'Gjør om' }).click()
  await expect.poll(pixel).not.toEqual(before)
})

test('edits a copy of an image with history, crop and project save', async ({ page }) => {
  await page.goto('/')
  const editButton = page.getByRole('button', { name: 'Rediger bilde' })
  await expect(editButton).toBeEnabled()
  await editButton.click()
  const picker = page.getByRole('dialog', { name: 'Velg bilde' })
  await expect(picker).toContainText('Ingen bilder på denne siden')
  await picker.getByRole('button', { name: 'Lukk' }).click()
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
  await page.locator('.image-import-control:has(.element-card--image) input[type="file"]').setInputFiles({
    name: 'original.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
  })
  const images = page.locator('.canvas-element--image')
  await expect(images).toHaveCount(1)
  await page.locator('.canvas-page').click({ position: { x: 2, y: 2 }, force: true })
  await editButton.click()
  await expect(picker.getByRole('button', { name: 'original.png' })).toBeVisible()
  await picker.getByRole('button', { name: 'original.png' }).click()
  const dialog = page.getByRole('dialog', { name: 'Rediger bilde' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByLabel('Bildeverktøy og innstillinger')).toBeVisible()
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
  await dialog.getByRole('button', { name: 'Lagre', exact: true }).click()
  await dialog.getByRole('menuitem', { name: 'Eksporter til fil…' }).click()
  await expect(dialog).toContainText('Bildefilen er lagret i valgt mappe.')

  await dialog.getByRole('button', { name: 'Lagre', exact: true }).click()
  await dialog.getByRole('menuitem', { name: 'Lagre som nytt bilde på siden' }).click()
  await expect(images).toHaveCount(2)
  await expect(dialog).toBeHidden()
  await page.waitForTimeout(900)
  await page.reload()
  await expect(images).toHaveCount(2)
})


test('copies the entire paint canvas as a PNG snapshot', async ({ page }) => {
  await page.addInitScript(() => {
    class TestClipboardItem {
      types: string[]
      constructor(data: Record<string, Blob>) {
        this.types = Object.keys(data)
      }
    }
    Object.defineProperty(window, 'ClipboardItem', {
      configurable: true,
      value: TestClipboardItem,
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        write: async (items: Array<{ types: string[] }>) => {
          ;(window as typeof window & { __paintClipboardTypes?: string[] })
            .__paintClipboardTypes = items.flatMap((item) => item.types)
        },
      },
    })
  })

  await page.goto('/')
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 120
    canvas.getContext('2d')!.fillRect(0, 0, 160, 120)
    return canvas.toDataURL('image/png').split(',')[1]
  })
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.locator('.image-import-control:has(.element-card--image) input[type="file"]').setInputFiles({
    name: 'snapshot.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
  })
  await page.getByRole('button', { name: 'Rediger bilde' }).click()

  const dialog = page.getByRole('dialog', { name: 'Rediger bilde' })
  await dialog.getByLabel('Kommentar').fill('Slå sammen bildene naturlig.')
  await dialog.getByRole('button', { name: 'Kopier snapshot' }).click()

  await expect(dialog).toContainText('Snapshot kopiert.')
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { __paintClipboardTypes?: string[] })
      .__paintClipboardTypes ?? [],
  )).toContain('image/png')
})
