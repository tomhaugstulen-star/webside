import { expect, test } from '@playwright/test'

test('closes the project panel from the canvas and switches pages from the toolbar', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()

  const pagesRegion = page.getByRole('region', { name: 'Sider' })
  await expect(pagesRegion).toBeVisible()
  await pagesRegion.getByRole('button', { name: '+ Ny side' }).click()

  const sideTwoCanvas = page.getByLabel('Nettside: Side 2')
  await expect(sideTwoCanvas).toBeVisible()
  await sideTwoCanvas.click({ position: { x: 20, y: 20 } })
  await expect(pagesRegion).toBeHidden()

  const pageSelector = page.getByLabel('Velg side')
  await expect(pageSelector.locator('option:checked')).toHaveText('Side 2')

  await pageSelector.selectOption({ label: 'Forside' })
  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()
  await expect(pageSelector.locator('option:checked')).toHaveText('Forside')

  await pageSelector.selectOption({ label: 'Side 2' })
  await expect(page.getByLabel('Nettside: Side 2')).toBeVisible()
  await expect(pageSelector.locator('option:checked')).toHaveText('Side 2')
})