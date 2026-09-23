import { expect, test, type Page } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function createHeader(page: Page) {
  await page.getByRole('button', { name: 'Logo og header', exact: true }).click()
  await page.getByLabel('Navn på nettsted eller firma').fill('Navigasjonstest')
  await page.locator('.header-creation-control__file-input').setInputFiles({
    name: 'logo.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })
  await page.getByRole('button', { name: 'Opprett header', exact: true }).click()
}

test('renders project navigation in Header and navigates to pages and sections', async ({
  page,
}) => {
  await page.addInitScript(() => {
    ;(window as unknown as { __phase20ScrollTarget?: string }).__phase20ScrollTarget =
      ''
    Element.prototype.scrollIntoView = function () {
      const element = this as HTMLElement
      ;(
        window as unknown as { __phase20ScrollTarget?: string }
      ).__phase20ScrollTarget = element.dataset.elementId ?? ''
    }
  })
  await page.goto('/')
  await createHeader(page)

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  const pagesRegion = page.getByRole('region', { name: 'Sider' })
  await pagesRegion.getByRole('button', { name: '+ Ny side' }).click()
  await expect(page.getByLabel('Nettside: Side 2')).toBeVisible()

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Seksjon', exact: true }).click()
  const section = page.getByRole('button', { name: /^Seksjon./ })
  const sectionId = await section.getAttribute('data-element-id')
  expect(sectionId).toBeTruthy()

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  const navigation = page.getByRole('region', { name: 'Nettstedmeny' })

  await navigation.getByLabel('Menutekst').fill('Om oss')
  await navigation.getByLabel('Mål').selectOption({ label: 'Side: Side 2' })
  await navigation
    .getByRole('button', { name: 'Legg til menypunkt' })
    .click()

  await navigation.getByLabel('Menutekst').fill('Kontakt')
  await navigation.getByLabel('Mål').selectOption({ label: 'Side 2 → #seksjon' })
  await navigation
    .getByRole('button', { name: 'Legg til menypunkt' })
    .click()

  await page.getByLabel('Velg side').selectOption({ label: 'Forside' })
  const header = page.locator('.canvas-element--header')
  const menu = header.getByRole('navigation', { name: 'Nettstedmeny' })
  const pageLink = menu.getByRole('button', { name: 'Om oss', exact: true })
  const sectionLink = menu.getByRole('button', {
    name: 'Kontakt',
    exact: true,
  })

  await expect(pageLink).toHaveAttribute('data-public-href', '/side-2')
  await expect(sectionLink).toHaveAttribute(
    'data-public-href',
    '/side-2#seksjon',
  )

  await pageLink.click()
  await expect(page.getByLabel('Nettside: Side 2')).toBeVisible()
  await expect(page.getByLabel('Velg side').locator('option:checked')).toHaveText(
    'Side 2',
  )

  await page.getByLabel('Velg side').selectOption({ label: 'Forside' })
  await sectionLink.click()
  await expect(page.getByLabel('Nettside: Side 2')).toBeVisible()
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { __phase20ScrollTarget?: string })
            .__phase20ScrollTarget,
      ),
    )
    .toBe(sectionId)

  await page.getByLabel('Velg side').selectOption({ label: 'Forside' })
  await page.getByRole('button', { name: 'Telefon', exact: true }).click()
  await expect(menu.getByRole('button', { name: 'Om oss', exact: true })).toBeVisible()
  await expect(menu.getByRole('button', { name: 'Kontakt', exact: true })).toBeVisible()
})
