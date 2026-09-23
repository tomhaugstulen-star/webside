import { expect, test } from '@playwright/test'
import { projectFileFixture, pngBase64 } from '../fixtures/projectFileFixture'
import { isValidEditorProject, parseImportedEditorProject } from '../../src/model/editorProjectValidation'
import { base64ToBytes, arrayBufferToBase64 } from '../../src/projectFiles/projectFileBase64'
import { readProjectFile, readProjectFileResult } from '../../src/projectFiles/readProjectFile'
import { createDuplicateProject } from '../../src/projectFiles/createDuplicateProject'
import { createProjectBackupFileName } from '../../src/projectFiles/projectFileFormat'
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
  const page = project.pages[0]
  if (page.appearance.backgroundFill.type !== 'solid') throw Error('Expected solid page')
  const legacy = {
    ...project,
    schemaVersion: 10,
    navigation: undefined,
    pages: [{
      ...page,
      appearance: { backgroundColor: page.appearance.backgroundFill.color },
      elements: [],
    }],
  }
  expect(parseImportedEditorProject(JSON.parse(JSON.stringify(legacy)))?.schemaVersion).toBe(15)
  for (const schemaVersion of [10, 11]) {
    expect(parseImportedEditorProject({
      ...legacy,
      schemaVersion,
      pages: [{ ...legacy.pages[0], elements: [null] }],
    })).toBeNull()
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

test('reports typed project-file import failures', async () => {
  const fixture = projectFileFixture()
  const cases = [
    ['{', 'invalid-json'],
    [JSON.stringify({ broken: true }), 'invalid-envelope'],
    [JSON.stringify({ ...fixture, formatVersion: 2 }), 'unsupported-format-version'],
    [JSON.stringify({ ...fixture, project: { ...fixture.project, schemaVersion: 99 } }), 'invalid-project'],
    [JSON.stringify({ ...fixture, assets: [] }), 'missing-asset'],
    [JSON.stringify({ ...fixture, assets: [...fixture.assets, { ...fixture.assets[0] }] }), 'duplicate-asset'],
  ] as const

  for (const [content, error] of cases) {
    const result = await readProjectFileResult(
      new File([content], 'broken.website-project'),
    )
    expect(result).toEqual({ ok: false, error })
    expect(await readProjectFile(new File([content], 'broken.website-project'))).toBeNull()
  }
})

test('creates deterministic backup names and independent project copies', () => {
  const { project } = projectFileFixture()
  const date = new Date('2026-09-23T16:30:45.123Z')
  const duplicate = createDuplicateProject(project, date)

  expect(createProjectBackupFileName('Ærlig Øvelse Å', date)).toBe(
    'aerlig-ovelse-a-backup-2026-09-23-16-30-45.website-project',
  )
  expect(duplicate.id).not.toBe(project.id)
  expect(duplicate.name).toBe(`Kopi av ${project.name}`)
  expect(duplicate.createdAt).toBe(date.toISOString())
  expect(duplicate.updatedAt).toBe(date.toISOString())
  expect(duplicate.pages).toBe(project.pages)
  expect(duplicate.navigation).toBe(project.navigation)
})


test('project file serialization preserves explicit mobile layout and visibility', async () => {
  const fixture = projectFileFixture()
  const image = fixture.project.pages[0].elements.find(
    (element) => element.id === 'image-1',
  )
  if (!image) throw new Error('Expected image fixture.')

  image.position.mobile = { x: 12, y: 80 }
  image.size.mobile = { width: 180, height: 120 }
  image.visibility.mobile = false

  const asset = fixture.assets[0]
  const file = new File(
    [base64ToBytes(asset.base64)!],
    asset.metadata.fileName,
    { type: asset.metadata.mimeType },
  )
  const blob = await createProjectFileBlob(
    fixture.project,
    () => ({ file, metadata: asset.metadata, objectUrl: 'blob:test' }),
  )
  expect(blob).not.toBeNull()

  const serialized = JSON.parse(await blob!.text())
  const importedProject = parseImportedEditorProject(serialized.project)
  expect(importedProject).not.toBeNull()
  const importedImage = importedProject!.pages[0].elements.find(
    (element) => element.id === 'image-1',
  )
  expect(importedImage).toBeTruthy()
  expect(importedImage!.position.mobile).toEqual({ x: 12, y: 80 })
  expect(importedImage!.size.mobile).toEqual({ width: 180, height: 120 })
  expect(importedImage!.visibility.mobile).toBe(false)
})
