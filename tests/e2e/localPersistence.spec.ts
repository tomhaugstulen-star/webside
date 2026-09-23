import { expect, test } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('autosave restores project structure and image assets after refresh', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  await page
    .locator('.image-import-control:has(.element-card--image) input[type="file"]')
    .setInputFiles({
      name: 'persisted.png',
      mimeType: 'image/png',
      buffer: onePixelPng,
    })

  const image = page.locator('.image-element__image')
  await expect(image).toBeVisible()
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBe(1)

  await expect(page.locator('.top-toolbar__save-status')).toHaveText('Lagret')

  await page.reload()

  await expect(page.getByLabel('Nettside: Forside')).toBeVisible()
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
  await page.locator('.project-navigator__page-button').filter({
    hasText: 'Side 2',
  }).click()
  await expect(page.locator('.project-navigator__element').filter({
    hasText: 'Bilde',
  })).toHaveCount(1)

  await expect(page.locator('.image-element__image')).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator('.image-element__image')
        .evaluate((node: HTMLImageElement) => node.naturalWidth),
    )
    .toBe(1)
})
