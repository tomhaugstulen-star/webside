import { expect, test } from '@playwright/test'

test('places new text and button inside the selected desktop section', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Seksjon', exact: true }).click()

  const section = page.locator('.canvas-element--section').first()
  await expect(section).toHaveCount(1)
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Tekst', exact: true }).click()
  const text = page.locator('.canvas-element--text').first()
  await expect(text).toHaveCSS('left', '32px')
  await expect(text).toHaveCSS('top', '32px')

  await section.click({ position: { x: 300, y: 30 } })
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Knapp', exact: true }).click()
  await page.getByRole('button', { name: /^Legg til / }).first().click()
  const button = page.locator('.canvas-element--button').first()
  await expect(button).toHaveCSS('left', '32px')
  await expect(button).toHaveCSS('top', '136px')
})
