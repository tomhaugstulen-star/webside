import { expect, test } from '@playwright/test'
import { createBlankProject, createEditorPage } from '../../src/model/createEditorProject'
import { createEditorElement } from '../../src/model/createEditorElement'
import { parseImportedEditorProject } from '../../src/model/editorProjectValidation'
import { createZip } from '../../src/export/createZip'
import { renderPublicElements } from '../../src/export/renderPublicElements'
import { normalizePublicUrl } from '../../src/model/siteSettings'
import { createImageAssetId } from '../../src/model/imageAsset'
import { pageFilePath, relativePageHref } from '../../src/export/sitePaths'
import { editorProjectReducer } from '../../src/state/editorProjectReducer'
import { DEFAULT_BUTTON_ASSET_ID } from '../../src/model/buttonAsset'

const decode = new TextDecoder()

test('ZIP contains readable file entries with correct CRC and no project JSON', async () => {
  const contents = new TextEncoder().encode('<!doctype html>Hei')
  const zip = new Uint8Array(await createZip([{ path: 'index.html', bytes: contents }]).arrayBuffer())
  const view = new DataView(zip.buffer)
  expect(view.getUint32(0, true)).toBe(0x04034b50)
  const nameLength = view.getUint16(26, true)
  expect(decode.decode(zip.slice(30, 30 + nameLength))).toBe('index.html')
  expect(decode.decode(zip.slice(30 + nameLength, 30 + nameLength + contents.length))).toBe('<!doctype html>Hei')
  expect(view.getUint32(zip.length - 22, true)).toBe(0x06054b50)
  expect(() => createZip([{ path: '../state.json', bytes: contents }])).toThrow()
})

test('relative links work from root and subpages under any upload directory', () => {
  expect(pageFilePath('/')).toBe('index.html')
  expect(pageFilePath('/om-oss')).toBe('om-oss/index.html')
  expect(relativePageHref('/', '/om-oss#kontakt')).toBe('om-oss/#kontakt')
  expect(relativePageHref('/om-oss', '/')).toBe('.././')
  expect(relativePageHref('/om-oss', '/om-oss#kontakt')).toBe('#kontakt')
  expect(normalizePublicUrl('https://example.no/sted')).toBe('https://example.no/sted/')
  expect(normalizePublicUrl('javascript:alert(1)')).toBeNull()
})

test('schema 15 projects migrate SEO and site settings without changing old pages', () => {
  const project = createBlankProject('Legacy')
  const legacy = { ...project, schemaVersion: 15, siteSettings: undefined,
    pages: project.pages.map((page) => {
      const oldPage: Record<string, unknown> = { ...page }
      delete oldPage.seo
      return oldPage
    }) }
  delete (legacy as Record<string, unknown>).siteSettings
  const migrated = parseImportedEditorProject(legacy)
  expect(migrated?.schemaVersion).toBe(16)
  expect(migrated?.siteSettings).toEqual({ language: 'nb', publicUrl: '' })
  expect(migrated?.pages[0].seo).toEqual({ title: 'Forside', description: '' })
})

test('site metadata changes atomically and unchanged values preserve state identity', () => {
  const project = createBlankProject('Test')
  const state = { project, activePageId: project.pages[0].id, selectedElementId: null }
  const action = { type: 'set-site-metadata' as const, name: 'Test',
    settings: { language: 'nb', publicUrl: 'https://example.no/' },
    pageId: state.activePageId, seo: { title: 'Ny tittel', description: 'Beskrivelse' },
    updatedAt: new Date().toISOString() }
  const updated = editorProjectReducer(state, action)
  expect(updated.project.pages[0].seo.title).toBe('Ny tittel')
  expect(updated.project.siteSettings.publicUrl).toBe('https://example.no/')
  expect(editorProjectReducer(updated, action)).toBe(updated)
  expect(editorProjectReducer(updated, { ...action, settings: { ...action.settings, publicUrl: 'javascript:bad' } })).toBe(updated)
})

test('public markup escapes content and resolves menu and section links', () => {
  const project = createBlankProject('Test')
  const second = createEditorPage('page-2', 'Om oss', '/om-oss')
  const section = createEditorElement({ id: 'section-1', request: { kind: 'section' }, existingElements: [] })
  const text = createEditorElement({ id: 'text-1', request: { kind: 'text' }, existingElements: [] })
  const header = createEditorElement({ id: 'header-1', request: { kind: 'header',
    logoAssetId: createImageAssetId(), logoAssetMetadata: {
      fileName: 'logo.png', mimeType: 'image/png', byteSize: 10, width: 1, height: 1,
    }, siteName: 'Test', subtitle: '' }, existingElements: [] })
  if (section.kind !== 'section' || text.kind !== 'text') throw Error('Fixture')
  project.pages.push({ ...second, elements: [section, header, { ...text, content: '<script>farlig</script>' }] })
  project.navigation.items.push({ id: 'nav-1', label: 'Om & oss',
    target: { type: 'section', pageId: second.id, elementId: section.id } })
  const html = renderPublicElements(project, second.slug, () => 'assets/image.png', () => ({ href: 'button.svg', color: '#fff' }))
  expect(html).toContain('href="#' + section.anchorId + '"')
  expect(html).toContain('Om &amp; oss')
  expect(html).toContain('&lt;script&gt;farlig&lt;/script&gt;')
  expect(html).not.toContain('<script>')
})

test('ordinary button opens navigation on every page without a Header', () => {
  const project = createBlankProject('Test')
  const home = project.pages[0]
  const second = createEditorPage('page-2', 'Om oss', '/om-oss')
  const section = createEditorElement({ id: 'section-1', request: { kind: 'section' }, existingElements: [] })
  const button = createEditorElement({ id: 'button-1', request: { kind: 'button', assetId: DEFAULT_BUTTON_ASSET_ID }, existingElements: [] })
  if (section.kind !== 'section' || button.kind !== 'button') throw Error('Fixture')
  project.pages.push({ ...second, elements: [section, button] })
  project.navigation.items.push(
    { id: 'home', label: 'Forside', target: { type: 'page', pageId: home.id } },
    { id: 'section', label: 'Les mer', target: { type: 'section', pageId: second.id, elementId: section.id } },
  )
  const state = { project, activePageId: second.id, selectedElementId: button.id }
  const updated = editorProjectReducer(state, {
    type: 'set-button-dropdown', elementId: button.id, dropdown: true, updatedAt: new Date().toISOString(),
  })
  expect(parseImportedEditorProject(updated.project)).not.toBeNull()
  expect(editorProjectReducer(updated, {
    type: 'set-element-link', elementId: button.id, link: {
      type: 'external-url', url: 'https://example.no', openInNewTab: false,
    }, updatedAt: new Date().toISOString(),
  })).toBe(updated)
  const html = renderPublicElements(updated.project, second.slug, () => 'unused',
    () => ({ href: 'button.svg', color: '#fff' }))
  expect(html).toContain('class="site-button-menu-toggle"')
  expect(html).toContain('href=".././"')
  expect(html).toContain(`href="#${section.anchorId}"`)
  expect(html).not.toContain('site-header')
})
