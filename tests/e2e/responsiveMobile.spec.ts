import { expect, test } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function createHero(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  const heroControl = page.locator('.image-import-control').filter({
    has: page.getByRole('button', { name: 'Hero', exact: true }),
  })
  await heroControl.locator('input[type="file"]').setInputFiles({
    name: 'hero.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })
  return page.locator('.canvas-element--hero')
}

test('Hero inherits responsively and mobile edits do not change desktop', async ({
  page,
}) => {
  await page.goto('/')
  const hero = await createHero(page)

  await hero.focus()
  for (let index = 0; index < 55; index += 1) {
    await page.keyboard.press('Control+Shift+ArrowRight')
  }

  const desktopWide = await hero.boundingBox()
  expect(desktopWide).not.toBeNull()
  expect(desktopWide!.width).toBeGreaterThan(390)

  await page.getByRole('button', { name: 'Mobil', exact: true }).click()
  const inheritedMobile = await hero.boundingBox()
  expect(inheritedMobile).not.toBeNull()
  expect(inheritedMobile!.width).toBeLessThanOrEqual(390)

  await hero.click()
  const mobileSection = page.getByRole('region', { name: 'Telefon' })
  await expect(mobileSection.getByText('Arver fra PC')).toBeVisible()

  await hero.focus()
  await page.keyboard.press('Control+Shift+ArrowLeft')

  const overriddenMobile = await hero.boundingBox()
  expect(overriddenMobile).not.toBeNull()
  expect(overriddenMobile!.width).toBeLessThan(inheritedMobile!.width)

  await hero.click()
  await expect(mobileSection.getByText('Eget mobiloppsett')).toBeVisible()

  await page.getByRole('button', { name: 'Skrivebord', exact: true }).click()
  const desktopAfterMobileEdit = await hero.boundingBox()
  expect(desktopAfterMobileEdit).not.toBeNull()
  expect(desktopAfterMobileEdit!.width).toBeCloseTo(desktopWide!.width, 0)

  await page.getByRole('button', { name: 'Mobil', exact: true }).click()
  await hero.click()
  await mobileSection.getByRole('button', { name: 'Bruk PC-oppsett' }).click()
  await expect(mobileSection.getByText('Arver fra PC')).toBeVisible()

  const resetMobile = await hero.boundingBox()
  expect(resetMobile).not.toBeNull()
  expect(resetMobile!.width).toBeLessThanOrEqual(390)

  await mobileSection.getByRole('button', { name: 'Skjul på mobil' }).click()
  await expect(hero).toBeHidden()

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.getByRole('button', { name: /Vis elementer/ }).click()
  await page.getByRole('button', { name: 'Vis på telefon' }).click()
  await expect(hero).toBeVisible()
})
