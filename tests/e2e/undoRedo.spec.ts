import { expect, test } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function createText(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Tekst', exact: true }).click()
  return page.getByRole('button', { name: /Tom tekstboks/ })
}

test('toolbar and keyboard undo redo project mutations', async ({ page }) => {
  await page.goto('/')

  const undo = page.getByRole('button', { name: 'Angre', exact: true })
  const redo = page.getByRole('button', { name: 'Gjør om', exact: true })
  await expect(undo).toBeDisabled()
  await expect(redo).toBeDisabled()

  const textElement = await createText(page)
  await expect(textElement).toBeVisible()
  await expect(undo).toBeEnabled()
  await expect(redo).toBeDisabled()

  await undo.click()
  await expect(textElement).toHaveCount(0)
  await expect(redo).toBeEnabled()

  await redo.click()
  await expect(textElement).toBeVisible()

  await page.keyboard.press('Control+Z')
  await expect(textElement).toHaveCount(0)
  await expect(redo).toBeEnabled()

  await page.keyboard.press('Control+Y')
  await expect(textElement).toBeVisible()

  await page.keyboard.press('Control+Z')
  await expect(textElement).toHaveCount(0)
  await expect(redo).toBeEnabled()

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Seksjon', exact: true }).click()
  await expect(page.getByRole('button', { name: /^Seksjon./ })).toBeVisible()
  await expect(redo).toBeDisabled()
})

test('undo restores inherited mobile layout without changing desktop', async ({
  page,
}) => {
  await page.goto('/')
  const textElement = await createText(page)

  const desktopBefore = await textElement.boundingBox()
  expect(desktopBefore).not.toBeNull()

  await page.getByRole('button', { name: 'Mobil', exact: true }).click()
  await textElement.focus()
  await page.keyboard.press('Control+Shift+ArrowRight')

  await textElement.click()
  const mobileSection = page.getByRole('region', { name: 'Telefon' })
  await expect(mobileSection.getByText('Eget mobiloppsett')).toBeVisible()

  await page.getByRole('button', { name: 'Angre', exact: true }).click()
  await expect(mobileSection.getByText('Arver fra PC')).toBeVisible()

  await page.getByRole('button', { name: 'Skrivebord', exact: true }).click()
  const desktopAfter = await textElement.boundingBox()
  expect(desktopAfter).not.toBeNull()
  expect(desktopAfter!.width).toBeCloseTo(desktopBefore!.width, 0)
  expect(desktopAfter!.height).toBeCloseTo(desktopBefore!.height, 0)
})


test('undo restores a deleted image with its asset intact', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()

  const imageInput = page.locator(
    '.image-import-control:has(.element-card--image) input[type="file"]',
  )
  await imageInput.setInputFiles({
    name: 'undo-image.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  const imageElement = page.locator('.canvas-element--image')
  const image = page.locator('.image-element__image')
  await expect(imageElement).toBeVisible()
  await expect(image).toBeVisible()
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBe(1)

  await imageElement.click()
  await page.getByRole('button', { name: 'Slett bilde', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Slett bildet?', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Du kan angre slettingen etterpå.')).toBeVisible()
  await page.getByRole('button', { name: 'Slett', exact: true }).click()
  await expect(imageElement).toHaveCount(0)

  await page.getByRole('button', { name: 'Angre', exact: true }).click()
  await expect(imageElement).toBeVisible()
  await expect(image).toBeVisible()
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBe(1)
})
