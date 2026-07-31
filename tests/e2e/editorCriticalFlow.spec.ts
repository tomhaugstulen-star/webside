import { expect, test } from '@playwright/test'

test('creates a text element and edits its persisted background color', async ({
  page,
}) => {
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
  await expect(textElement).toHaveCSS('background-color', 'rgb(255, 255, 255)')

  await textElement.click()

  await expect(
    page.getByRole('heading', { name: 'Egenskaper', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('Ulåst', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Lukk egenskaper' }).click()
  await expect(
    page.getByRole('heading', { name: 'Egenskaper', exact: true }),
  ).toBeHidden()

  await page.getByRole('button', { name: 'Farger', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Farger', exact: true }),
  ).toBeVisible()

  const textColorGroup = page.getByRole('region', { name: 'Tekst 1' })
  await expect(textColorGroup).toBeVisible()
  await expect(
    textColorGroup.locator('.color-swatch-input > span:first-child'),
  ).toHaveText(['Bakgrunn', 'Tekstfarge'])

  const backgroundInput = textColorGroup.getByLabel(/Bakgrunn\. Nåværende farge/)
  await backgroundInput.evaluate((input: HTMLInputElement) => {
    input.value = '#e8f1ff'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })

  await expect(textElement).toHaveCSS('background-color', 'rgb(232, 241, 255)')
})
