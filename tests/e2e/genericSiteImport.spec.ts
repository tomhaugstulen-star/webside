import { expect, test } from '@playwright/test'
import { createZip } from '../../src/export/createZip'

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

async function siteZip() {
  const encoder = new TextEncoder()
  const home = encoder.encode(
    '<!doctype html><html><head><title>Importert side</title>' +
    '<style>.site-header{width:900px;height:88px;background:#FFFFFF}</style>' +
    '</head><body>' +
    '<header class="site-header"><img src="assets/logo.png" alt="Logo" data-image-key="image.logo">' +
    '<strong data-content="hero.name">Standardnavn</strong><nav><a href="about/">Om oss</a></nav></header>' +
    '<section class="hero" style="width:900px;height:320px;background:#223344">' +
    '<img src="assets/logo.png" alt="Hero"><h1>Stor overskrift</h1>' +
    '<p>Hero-tekst</p><a href="https://example.com">Les mer</a></section>' +
    '<main><h1>Velkommen</h1><p>Redigerbar tekst fra ZIP.</p>' +
    '<ul style="width:220px"><li>Vanskeligheter med å ta valg når teksten brytes over flere linjer</li></ul></main>' +
    '</body></html>',
  )
  const about = encoder.encode(
    '<!doctype html><html><head><title>Om oss</title></head>' +
    '<body><h1>Om oss</h1></body></html>',
  )
  const content = encoder.encode(JSON.stringify({
    'hero.name': 'Navn fra admin',
    'image.logo': 'assets/logo.png',
  }))
  const blob = createZip([
    { path: 'index.html', bytes: home },
    { path: 'content.json', bytes: content },
    { path: 'about/index.html', bytes: about },
    { path: 'assets/logo.png', bytes: new Uint8Array(onePixelPng) },
  ])
  return Buffer.from(await blob.arrayBuffer())
}

test('imports generic HTML ZIP as editable browser project', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Prosjekt', exact: true }).click()
  const input = page.locator('.project-file-controls__site-input')
  await input.setInputFiles({
    name: 'ekstern-side.zip',
    mimeType: 'application/zip',
    buffer: await siteZip(),
  })

  await expect(page.getByRole('status')).toContainText(
    'Importerte nettstedet «ekstern side».',
  )
  await expect(page.getByText('2 sider', { exact: true })).toBeVisible()
  await expect(page.locator('.header-element__logo')).toBeVisible()
  await expect(page.getByText('Navn fra admin', { exact: true })).toBeVisible()
  await expect(page.locator('.hero-element__image')).toBeVisible()
  await expect(page.getByText('Stor overskrift', { exact: true })).toBeVisible()
  await expect(page.getByText('Velkommen', { exact: true })).toBeVisible()
  const wrapped = page.locator('.canvas-element--text').filter({
    hasText: 'Vanskeligheter med å ta valg',
  })
  await expect(wrapped).toBeVisible()
  expect(await wrapped.evaluate((element) => element.clientHeight)).toBeGreaterThan(48)

  await page.getByRole('button', { name: 'Innstillinger' }).click()
  await expect(page.getByText('Om oss', { exact: true })).toBeVisible()
})
