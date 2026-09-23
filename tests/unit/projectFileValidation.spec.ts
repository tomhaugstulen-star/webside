import { expect, test } from '@playwright/test'
import { projectFileFixture, pngBase64 } from '../fixtures/projectFileFixture'
import { isValidEditorProject, parseImportedEditorProject } from '../../src/model/editorProjectValidation'
import { createEditorElement } from '../../src/model/createEditorElement'
import { base64ToBytes, arrayBufferToBase64 } from '../../src/projectFiles/projectFileBase64'
import { readProjectFile } from '../../src/projectFiles/readProjectFile'
import { createProjectFileBlob } from '../../src/projectFiles/createProjectFile'
import { getProjectAssetReferences } from '../../src/projectFiles/projectAssetReferences'
import { imageBytesMatchMimeType } from '../../src/assets/images/imageFileSignature'

for (const [name, change] of [
  ['locked Header', (h: Record<string, unknown>) => { h.locked = true }],
  ['offset Header', (h: Record<string, unknown>) => { h.position = { desktop: { x: 1, y: 0 } } }],
  ['noncanonical Header width', (h: Record<string, unknown>) => { h.size = { desktop: { width: 300, height: 88 } } }],
  ['blank Header name', (h: Record<string, unknown>) => { h.siteName = '' }],
  ['unnormalized subtitle', (h: Record<string, unknown>) => { h.subtitle = ' Test ' }],
] as const) {
  test(`rejects ${name} at import`, () => {
    const { project } = projectFileFixture()
    change(project.pages[0].elements[1] as unknown as Record<string, unknown>)
    expect(parseImportedEditorProject(project)).toBeNull()
  })
}

test('rejects crop layouts exceeding the decoded image extent', () => {
  const { project } = projectFileFixture()
  const image = project.pages[0].elements[0]
  if (image.kind !== 'image') throw Error('Expected image')
  image.mode = 'crop'
  image.size.desktop = { width: 600, height: 400 }
  expect(isValidEditorProject(project)).toBe(false)
})

test('independent responsive fields inherit desktop without rejecting valid data', () => {
  const { project } = projectFileFixture()
  project.pages[0].elements[0].position.mobile = { x: 0, y: 0 }
  expect(isValidEditorProject(project)).toBe(true)
  project.pages[0].elements[0].position.mobile.x = -1
  expect(isValidEditorProject(project)).toBe(false)
})

test('migrates schema 10 and safely rejects malformed schema 10/11', () => {
  const { project } = projectFileFixture()
  const section = createEditorElement({ id: 'section', request: { kind: 'section' }, existingElements: [] })
  const legacy = { ...project, schemaVersion: 10, navigation: undefined, pages: [{ ...project.pages[0], elements: [section] }] }
  expect(parseImportedEditorProject(JSON.parse(JSON.stringify(legacy)))?.schemaVersion).toBe(13)
  for (const schemaVersion of [10, 11]) {
    expect(parseImportedEditorProject({ ...legacy, schemaVersion, pages: [{ ...legacy.pages[0], elements: [null] }] })).toBeNull()
  }
})

test('rejects corrupt base64 including altered padding bits', () => {
  const bytes = base64ToBytes(pngBase64)!
  expect(arrayBufferToBase64(bytes.buffer)).toBe(pngBase64)
  for (const value of ['%', 'YQ', 'YR==', 'YQ==\n']) expect(base64ToBytes(value)).toBeNull()
})

test('checks file signatures independently of declared MIME', () => {
  const png = base64ToBytes(pngBase64)!
  expect(imageBytesMatchMimeType(png, 'image/png')).toBe(true)
  expect(imageBytesMatchMimeType(png, 'image/jpeg')).toBe(false)
  expect(imageBytesMatchMimeType(new Uint8Array([255, 216, 255]), 'image/jpeg')).toBe(true)
  expect(imageBytesMatchMimeType(new TextEncoder().encode('RIFF1234WEBP'), 'image/webp')).toBe(true)
  expect(imageBytesMatchMimeType(new Uint8Array(), 'image/webp')).toBe(false)
})

test('deduplicates shared image/logo references and rejects conflicting metadata', () => {
  const { project } = projectFileFixture()
  expect(getProjectAssetReferences(project)).toHaveLength(1)
  const header = project.pages[0].elements[1]
  if (header.kind !== 'header') throw Error('Expected header')
  header.logoAssetMetadata = { ...header.logoAssetMetadata, width: 2 }
  expect(getProjectAssetReferences(project)).toBeNull()
})

test('export includes a shared image/logo exactly once and refuses missing resources', async () => {
  const fixture = projectFileFixture()
  const asset = fixture.assets[0]
  const file = new File([base64ToBytes(asset.base64)!], asset.metadata.fileName, { type: asset.metadata.mimeType })
  const blob = await createProjectFileBlob(fixture.project, () => ({ file, metadata: asset.metadata, objectUrl: 'blob:test' }))
  expect(JSON.parse(await blob!.text())).toEqual(fixture)
  expect(await createProjectFileBlob(fixture.project, () => null)).toBeNull()
})

test('rejects invalid JSON, unsupported formats/schema and dangling assets before decoding', async () => {
  const fixture = projectFileFixture()
  const candidates = ['{', JSON.stringify({ ...fixture, formatVersion: 2 }), JSON.stringify({ ...fixture, assets: [] }), JSON.stringify({ ...fixture, project: { ...fixture.project, schemaVersion: 99 } })]
  for (const content of candidates) {
    expect(await readProjectFile(new File([content], 'broken.website-project'))).toBeNull()
  }
})
