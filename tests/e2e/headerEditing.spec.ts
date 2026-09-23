import { expect, test, type Page } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function createHeader(page: Page) {
  await page.getByRole('button', { name: 'Logo og header', exact: true }).click()
  await page.getByLabel('Navn på nettsted eller firma').fill('Opprinnelig navn')
  await page.getByLabel('Undertittel').fill('Opprinnelig undertittel')
  await page.locator('.header-creation-control__file-input').setInputFiles({
    name: 'logo.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })
  await page.getByRole('button', { name: 'Opprett header', exact: true }).click()
}

test('edits Header text and replaces logo from the properties panel', async ({ page }) => {
  await page.goto('/')
  await createHeader(page)

  const header = page.locator('.canvas-element--header')
  await header.click()

  const properties = page.getByRole('complementary')
  await properties.getByLabel('Navn på nettsted eller firma').fill('Nytt navn')
  await properties.getByLabel('Undertittel').fill('')
  await properties.getByRole('button', { name: 'Lagre Header-tekst' }).click()

  await expect(header.locator('.header-element__site-name')).toHaveText('Nytt navn')
  await expect(header.locator('.header-element__subtitle')).toHaveCount(0)

  await properties.locator('.hero-properties__file-input').setInputFiles({
    name: 'ny-logo.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  await expect(properties.locator('.hero-properties__file-name')).toHaveText('ny-logo.png')
  await expect(properties.getByText('Logoen er byttet.')).toBeVisible()
})
