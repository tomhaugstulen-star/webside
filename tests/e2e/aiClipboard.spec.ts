import { expect, test, type Page } from '@playwright/test'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function createHeader(page: Page) {
  await page.getByRole('button', { name: 'Logo og header', exact: true }).click()
  await page.getByLabel('Navn på nettsted eller firma').fill('Opprinnelig navn')
  await page.getByLabel('Undertittel').fill('Opprinnelig undertittel')
  await page.locator('.header-creation-control__file-input').setInputFiles({
    name: 'logo.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })
  await page.getByRole('button', { name: 'Opprett header', exact: true }).click()
}

async function createHero(page: Page) {
  await page.getByRole('button', { name: 'Elementer', exact: true }).click()
  const heroControl = page.locator('.image-import-control').filter({
    has: page.getByRole('button', { name: 'Hero', exact: true }),
  })
  await heroControl.locator('input[type="file"]').setInputFiles({
    name: 'hero.png',
    mimeType: 'image/png',
    buffer: onePixelPng,
  })
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ClipboardItem', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          ;(window as typeof window & { __aiClipboardText?: string }).__aiClipboardText = text
        },
      },
    })
  })
})

test('copies a Header with dimensions and the user instruction', async ({ page }) => {
  await page.goto('/')
  await createHeader(page)

  await page.locator('.canvas-element--header').click({ button: 'right' })
  const panel = page.getByRole('dialog', { name: 'Send element til ChatGPT' })
  await expect(panel).toContainText('Header')
  await expect(panel).toContainText('Opprinnelig navn')
  await expect(panel).toContainText('88 px')

  await panel.getByLabel('Kommentar').fill('Gjør headeren roligere og mer premium.')
  await panel.getByRole('button', { name: 'Kopier til ChatGPT' }).click()

  const clip = await page.evaluate(() =>
    (window as typeof window & { __aiClipboardText?: string }).__aiClipboardText ?? '',
  )
  expect(clip).toContain('WEBSITE_EDITOR_CLIP v1')
  expect(clip).toContain('Type: Header')
  expect(clip).toContain('Element: Opprinnelig navn')
  expect(clip).toMatch(/Width: \d+ px/)
  expect(clip).toContain('Height: 88 px')
  expect(clip).toContain('Gjør headeren roligere og mer premium.')
})

test('opens the same ChatGPT panel for a non-Header element', async ({ page }) => {
  await page.goto('/')
  await createHero(page)

  await page.locator('.canvas-element--hero').click({ button: 'right' })
  const panel = page.getByRole('dialog', { name: 'Send element til ChatGPT' })
  await expect(panel).toContainText('Hero')

  await panel.getByLabel('Kommentar').fill('Lag et nytt bilde til denne flaten.')
  await panel.getByRole('button', { name: 'Kopier til ChatGPT' }).click()

  const clip = await page.evaluate(() =>
    (window as typeof window & { __aiClipboardText?: string }).__aiClipboardText ?? '',
  )
  expect(clip).toContain('Type: Hero')
  expect(clip).toContain('Lag et nytt bilde til denne flaten.')
})
