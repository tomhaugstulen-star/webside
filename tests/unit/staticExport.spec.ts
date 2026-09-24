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
import { PUBLIC_DESKTOP_WIDTH } from '../../src/export/siteDimensions'

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

test('export keeps elements placed in the editor’s expanded desktop canvas', () => {
  const project = createBlankProject('Bredt lerret')
  const section = createEditorElement({ id: 'section-1', request: { kind: 'section' }, existingElements: [] })
  if (section.kind !== 'section') throw Error('Fixture')
  project.pages[0].elements.push({ ...section,
    position: { desktop: { x: 594, y: 180 } },
    size: { desktop: { width: 537, height: 478 } },
  })
  const html = renderPublicElements(project, '/', () => 'unused', () => ({ href: 'unused', color: '#fff' }))
  expect(html).toContain('--d-x:594px')
  expect(html).toContain('--d-w:537px')
  expect(594 + 537).toBeLessThanOrEqual(PUBLIC_DESKTOP_WIDTH)
})
