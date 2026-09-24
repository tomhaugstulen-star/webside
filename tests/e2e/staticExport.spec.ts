import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

function zipFiles(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const files = new Map<string, string>()
  let offset = 0
  while (view.getUint32(offset, true) === 0x04034b50) {
    const length = view.getUint16(offset + 26, true)
    const extra = view.getUint16(offset + 28, true)
    const size = view.getUint32(offset + 18, true)
    const name = new TextDecoder().decode(bytes.slice(offset + 30, offset + 30 + length))
    const content = offset + 30 + length + extra
    files.set(name, new TextDecoder().decode(bytes.slice(content, content + size)))
    offset = content + size
  }
  return files
}

test('exports a standalone site with saved SEO and no editor state', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Innstillinger' }).click()
  await page.getByLabel('Prosjektnavn').fill('Min nettside')
  await page.getByLabel('Offentlig domene (valgfritt)').fill('https://example.no/nettside/')
  await page.getByLabel('Sidens tittel').fill('Min startside')
  await page.getByLabel('Beskrivelse').fill('En ferdig nettside')
  await page.getByRole('button', { name: 'Lagre innstillinger' }).click()
  await expect(page.getByRole('status').getByText('Prosjektinnstillinger lagret.')).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Eksporter nettsted' }).click()
  const file = await download
  expect(file.suggestedFilename()).toBe('min-nettside-nettside.zip')
  const files = zipFiles(await readFile(await file.path()))
  const html = files.get('index.html') ?? ''
  expect(html).toContain('<title>Min startside</title>')
  expect(html).toContain('content="En ferdig nettside"')
  expect(html).toContain('https://example.no/nettside/')
  expect(html).toMatch(/assets\/site-[a-f0-9]+\.css/)
  expect(files.get('sitemap.xml')).toContain('https://example.no/nettside/')
  expect([...files.keys()].some((name) => name.endsWith('.website-project'))).toBe(false)
  expect(files.has('assets/site.js')).toBe(false)
})
