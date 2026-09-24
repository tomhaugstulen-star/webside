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

async function setClipboardText(page: Page, value: string) {
  await page.evaluate((text) => {
    ;(window as typeof window & { __aiClipboardText?: string }).__aiClipboardText = text
  }, value)
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
        readText: async () =>
          (window as typeof window & { __aiClipboardText?: string }).__aiClipboardText ?? '',
      },
    })
  })
})

test('copies Header context and applies a validated AI proposal only after approval', async ({ page }) => {
  await page.goto('/')
  await createHeader(page)

  const header = page.locator('.canvas-element--header')
  await header.click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'Kopier til ChatGPT' }).click()

  const clip = await page.evaluate(() =>
    (window as typeof window & { __aiClipboardText?: string }).__aiClipboardText ?? '',
  )
  expect(clip).toContain('WEBSITE_EDITOR_CLIP v1')
  expect(clip).toContain('"lockedFrame": true')
  expect(clip).toContain('"format": "website-editor-ai-v1"')

  const targetText = clip.split('Target:\n')[1]?.split('\n\nCurrentDesign:')[0]
  const designText = clip.split('CurrentDesign:\n')[1]?.split('\n\nInstruks til ChatGPT:')[0]
  if (!targetText || !designText) throw new Error('AI clip is missing structured data.')

  const target = JSON.parse(targetText) as {
    elementId: string
    viewport: 'desktop' | 'mobile'
    width: number
    height: number
  }
  const current = JSON.parse(designText) as {
    appearance: Record<string, unknown>
  }
  const proposal = JSON.stringify({
    format: 'website-editor-ai-v1',
    type: 'header',
    elementId: target.elementId,
    viewport: target.viewport,
    width: target.width,
    height: target.height,
    siteName: 'AI navn',
    subtitle: 'AI undertittel',
    appearance: {
      ...current.appearance,
      textColor: '#112233',
      fontSize: 28,
    },
  })

  await setClipboardText(page, proposal)
  await header.click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'Lim inn AI-forslag' }).click()
  const preview = page.getByRole('dialog', { name: 'AI-forslag til Header' })
  await expect(preview).toBeVisible()
  await expect(header.locator('.header-element__site-name')).toHaveText('Opprinnelig navn')

  await preview.getByRole('button', { name: 'Avbryt' }).click()
  await expect(preview).toBeHidden()
  await expect(header.locator('.header-element__site-name')).toHaveText('Opprinnelig navn')

  await setClipboardText(page, proposal)
  await header.click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'Lim inn AI-forslag' }).click()
  await preview.getByRole('button', { name: 'Bruk forslag' }).click()

  await expect(header.locator('.header-element__site-name')).toHaveText('AI navn')
  await expect(header.locator('.header-element__subtitle')).toHaveText('AI undertittel')

  await page.getByRole('button', { name: 'Angre', exact: true }).click()
  await expect(header.locator('.header-element__site-name')).toHaveText('Opprinnelig navn')
  await expect(header.locator('.header-element__subtitle')).toHaveText('Opprinnelig undertittel')
})

test('rejects an invalid AI proposal without changing the Header', async ({ page }) => {
  await page.goto('/')
  await createHeader(page)

  const header = page.locator('.canvas-element--header')
  await setClipboardText(page, JSON.stringify({
    format: 'website-editor-ai-v1',
    type: 'header',
    html: '<header>ikke tillatt</header>',
  }))

  await header.click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'Lim inn AI-forslag' }).click()
  await expect(page.getByText('AI-forslaget har ukjent eller manglende struktur.')).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'AI-forslag til Header' })).toHaveCount(0)
  await expect(header.locator('.header-element__site-name')).toHaveText('Opprinnelig navn')
})
