import { expect, test, type Page } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function openProject(page: Page) {
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
}

test('project file round-trip restores pages and imported image assets', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Logo og header', exact: true }).click()
  await page.getByLabel('Navn på nettsted eller firma').fill('Round-trip logo')
  await page.locator('.header-creation-control__file-input').setInputFiles({
    name: 'logo.png', mimeType: 'image/png', buffer: onePixelPng,
  })
  await expect(page.getByText('logo.png', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Opprett header', exact: true }).click()
  await openProject(page)

  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()

  const imageInput = page.locator('.project-image-import input[type="file"]')
  await imageInput.setInputFiles({
    name: 'pixel.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })

  await openProject(page)
  await expect(page.locator('.project-navigator__element').filter({ hasText: 'Bilde' })).toHaveCount(1)

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Lagre prosjektfil', exact: true }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('nytt-prosjekt.website-project')
  const projectPath = await download.path()
  expect(projectPath).not.toBeNull()

  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('3 sider', { exact: true })).toBeVisible()

  const projectInput = page.locator('.project-file-controls__input')
  await projectInput.setInputFiles(projectPath!)
  await expect(page.getByText('Åpnet «Nytt prosjekt».', { exact: true })).toBeVisible()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
  await expect(page.locator('.project-navigator__element').filter({ hasText: 'Bilde' })).toHaveCount(1)

  const restoredLogo = page.locator('.header-element__logo')
  await expect(restoredLogo).toBeVisible()
  await expect.poll(() => restoredLogo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1)
  await page.locator('.project-navigator__page-button').filter({ hasText: 'Side 2' }).click()
  const restoredImage = page.locator('.image-element__image')
  await expect(restoredImage).toBeVisible()
  await expect.poll(() => restoredImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1)
})

test('invalid project file is rejected without replacing the current project', async ({ page }) => {
  await page.goto('/')
  await openProject(page)
  await page.getByRole('button', { name: '+ Ny side', exact: true }).click()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()

  await page.locator('.project-file-controls__input').setInputFiles({
    name: 'broken.website-project',
    mimeType: 'application/json',
    buffer: Buffer.from('{"broken":true}', 'utf8'),
  })

  await expect(
    page.getByText('Prosjektfilen er ugyldig eller skadet.', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
})
