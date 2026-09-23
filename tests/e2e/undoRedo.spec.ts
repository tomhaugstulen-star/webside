import { expect, test } from '@playwright/test'

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
