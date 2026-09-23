import { expect, test } from '@playwright/test'

test('manages pages, section anchors and website navigation', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()

  const pagesRegion = page.getByRole('region', { name: 'Sider' })
  await expect(pagesRegion).toBeVisible()
  await pagesRegion.getByRole('button', { name: '+ Ny side' }).click()

  const activePage = page.locator('.project-navigator__page-button--active')
  await expect(activePage).toContainText('Side 2')
  await expect(activePage).toContainText('/side-2')

  await pagesRegion.getByText('Navn, adresse og siderekkefølge').click()
  await pagesRegion.getByLabel('Navn').fill('Om oss')
  await pagesRegion.getByRole('button', { name: 'Lagre navn' }).click()
  await expect(activePage).toContainText('Om oss')

  await pagesRegion.getByLabel('Sideadresse').fill('Om oss')
  await pagesRegion.getByRole('button', { name: 'Lagre adresse' }).click()
  await expect(activePage).toContainText('/om-oss')

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Seksjon', exact: true }).click()

  const sectionElement = page.getByRole('button', { name: /^Seksjon\./ })
  await sectionElement.click()

  const anchorRegion = page.getByRole('region', { name: 'Seksjons-ID' })
  await expect(anchorRegion).toBeVisible()
  await anchorRegion.getByLabel('ID').fill('Kontakt oss')
  await anchorRegion.getByRole('button', { name: 'Lagre' }).click()
  await expect(anchorRegion.getByLabel('ID')).toHaveValue('kontakt-oss')

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()

  const navigationRegion = page.getByRole('region', { name: 'Nettstedmeny' })
  await navigationRegion.getByLabel('Menutekst').fill('Kontakt')
  await navigationRegion
    .getByLabel('Mål')
    .selectOption({ label: 'Om oss → #kontakt-oss' })
  await navigationRegion
    .getByRole('button', { name: 'Legg til menypunkt' })
    .click()

  const savedItem = navigationRegion.getByRole('listitem')
  await expect(savedItem.getByLabel('Menutekst')).toHaveValue('Kontakt')
  await expect(savedItem.getByLabel('Mål')).toHaveValue(/section:/)
})

test('keeps project panel compact and adds an active page to the menu', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await expect(page.getByText('Importer bilde')).toHaveCount(0)
  await page.getByRole('region', { name: 'Sider' }).getByRole('button', { name: '+ Ny side' }).click()
  await page.getByRole('button', { name: 'Legg Side 2 i nettstedmenyen' }).click()
  await expect(page.getByRole('region', { name: 'Nettstedmeny' })
    .getByRole('listitem').getByLabel('Menutekst')).toHaveValue('Side 2')
  await expect(page.getByText('Ingen elementer matcher filteret')).toHaveCount(0)
  await page.getByRole('button', { name: 'Vis elementer (0)' }).click()
  await expect(page.getByText('Ingen elementer matcher filteret')).toHaveCount(1)
})
