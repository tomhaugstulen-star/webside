import { expect, test } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('creates and edits a Hero without navigating away from the editor', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  const heroControl = page.locator('.image-import-control').filter({
    has: page.getByRole('button', { name: 'Hero', exact: true }),
  })
  await heroControl.locator('input[type="file"]').setInputFiles({
    name: 'hero.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  const hero = page.locator('.canvas-element--hero')
  await expect(hero).toBeVisible()
  await expect(hero).toHaveAttribute('aria-pressed', 'true')

  await hero.click()
  await expect(
    page.getByRole('heading', { name: 'Egenskaper', exact: true }),
  ).toBeVisible()

  const heroProperties = page.locator('.hero-properties')
  await heroProperties.getByLabel('Overskrift').fill('Et bedre førsteinntrykk')
  await heroProperties.getByLabel('Undertittel').fill('Kort og tydelig introduksjon')
  await heroProperties.getByLabel('CTA-tekst').fill('Se mer')
  await page.getByRole('button', { name: 'Lagre Hero-tekst' }).click()

  await expect(hero).toContainText('Et bedre førsteinntrykk')
  await expect(hero).toContainText('Kort og tydelig introduksjon')
  await expect(hero).toContainText('Se mer')

  const linkSection = page.getByRole('region', { name: 'Lenke' })
  await linkSection.getByLabel('Type').selectOption('external-url')
  await linkSection.getByLabel('Nettadresse').fill('https://example.com/hero')
  await linkSection.getByRole('button', { name: 'Lag lenke' }).click()

  await expect(
    linkSection.getByText('Lenken er lagret på Hero-knappen.'),
  ).toBeVisible()
  await expect(page).toHaveURL(/127\.0\.0\.1:4173\/?$/)
})
