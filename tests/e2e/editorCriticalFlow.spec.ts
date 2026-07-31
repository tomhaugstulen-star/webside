import { expect, test } from '@playwright/test'

test('creates a text element and opens its properties', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Elementer', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Tekst', exact: true }).click()

  const textElement = page.getByRole('button', { name: /Tom tekstboks/ })
  await expect(textElement).toBeVisible()
  await expect(textElement).toHaveAttribute('aria-pressed', 'true')

  await textElement.click()

  await expect(
    page.getByRole('heading', { name: 'Egenskaper', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Ulåst', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Lukk egenskaper' }).click()
  await expect(
    page.getByRole('heading', { name: 'Egenskaper', exact: true }),
  ).toBeHidden()
})
