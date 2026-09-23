import { expect, test } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('saves, reloads and inserts a reusable section template as one undo step', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Seksjon', exact: true }).click()

  const sections = page.locator('.canvas-element--section')
  await expect(sections).toHaveCount(1)
  await sections.first().click()

  const saveRegion = page.getByRole('region', { name: 'Gjenbrukbar seksjon' })
  await expect(saveRegion).toBeVisible()
  await saveRegion.getByLabel('Malnavn').fill('Kontaktblokk')
  await saveRegion.getByRole('button', { name: 'Lagre som mal' }).click()
  await expect(saveRegion).toContainText('Malen er lagret i malbiblioteket.')
  await page.waitForTimeout(900)

  await page.reload()
  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Maler', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Maler', exact: true })).toBeVisible()
  const card = page.locator('.template-library__card').filter({
    hasText: 'Kontaktblokk',
  })
  await expect(card).toContainText('1 elementer')

  await card.getByRole('button', { name: 'Sett inn' }).click()
  await expect(sections).toHaveCount(2)

  await page.getByRole('button', { name: 'Angre', exact: true }).click()
  await expect(sections).toHaveCount(1)

  await page.getByRole('button', { name: 'Gjør om', exact: true }).click()
  await expect(sections).toHaveCount(2)

  page.on('dialog', (dialog) => void dialog.accept())
  await card.getByRole('button', { name: 'Slett' }).click()
  await expect(page.getByText('Ingen seksjonsmaler er lagret ennå.')).toBeVisible()
})


test('template image survives insertion, undo and redo', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Seksjon', exact: true }).click()

  const imageInput = page.locator(
    '.image-import-control:has(.element-card--image) input[type="file"]',
  )
  await imageInput.setInputFiles({
    name: 'template-image.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  const images = page.locator('.canvas-element--image')
  await expect(images).toHaveCount(1)

  const section = page.locator('.canvas-element--section').first()
  await section.click()
  const saveRegion = page.getByRole('region', { name: 'Gjenbrukbar seksjon' })
  await saveRegion.getByLabel('Malnavn').fill('Bildemal')
  await saveRegion.getByRole('button', { name: 'Lagre som mal' }).click()
  await expect(saveRegion).toContainText('Malen er lagret i malbiblioteket.')

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page.getByRole('button', { name: 'Maler', exact: true }).click()
  const card = page.locator('.template-library__card').filter({ hasText: 'Bildemal' })
  await card.getByRole('button', { name: 'Sett inn' }).click()

  await expect(images).toHaveCount(2)
  await expect
    .poll(() =>
      page.locator('.image-element__image').nth(1).evaluate(
        (node: HTMLImageElement) => node.naturalWidth,
      ),
    )
    .toBe(1)

  await page.getByRole('button', { name: 'Angre', exact: true }).click()
  await expect(images).toHaveCount(1)

  await page.getByRole('button', { name: 'Gjør om', exact: true }).click()
  await expect(images).toHaveCount(2)
  await expect
    .poll(() =>
      page.locator('.image-element__image').nth(1).evaluate(
        (node: HTMLImageElement) => node.naturalWidth,
      ),
    )
    .toBe(1)
})
