import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createBlankProject } from '../../src/model/createEditorProject'
import {
  isValidEditorProject,
  parseImportedEditorProject,
} from '../../src/model/editorProjectValidation'

test('accepts a current blank project', () => {
  const project = createBlankProject('Test')
  expect(project.schemaVersion).toBe(17)
  expect(isValidEditorProject(project)).toBe(true)
  expect(parseImportedEditorProject(project)).toEqual(project)
})

test('migrates a schema 14 project and rejects orphan menu children', () => {
  const project = createBlankProject('Meny')
  const target = { type: 'page' as const, pageId: project.pages[0].id }
  const old = { ...project, schemaVersion: 14, navigation: { items: [
    { id: 'nav-1', label: 'Forside', target },
  ] } }
  expect(parseImportedEditorProject(old)?.schemaVersion).toBe(17)
  expect(isValidEditorProject({ ...project, navigation: { items: [
    { id: 'orphan', label: 'Feil', target, parentId: 'missing' },
  ] } })).toBe(false)
})

test('migrates schema 12 solid backgrounds to current fills', () => {
  const project = createBlankProject('Legacy')
  const page = project.pages[0]
  const text = createEditorElement({
    id: 'text-1',
    request: { kind: 'text' },
    existingElements: [],
  })
  if (text.kind !== 'text') throw new Error('Expected text element.')
  if (page.appearance.backgroundFill.type !== 'solid') throw new Error('Expected solid page.')
  if (text.appearance.backgroundFill.type !== 'solid') throw new Error('Expected solid text.')

  const legacy = {
    ...project,
    schemaVersion: 12,
    pages: [{
      ...page,
      appearance: { backgroundColor: page.appearance.backgroundFill.color },
      elements: [{
        ...text,
        appearance: {
          backgroundColor: text.appearance.backgroundFill.color,
          frame: text.appearance.frame,
        },
      }],
    }],
  }

  const migrated = parseImportedEditorProject(legacy)
  expect(migrated?.schemaVersion).toBe(17)
  expect(migrated?.pages[0].appearance.backgroundFill).toEqual({
    type: 'solid',
    color: '#FFFFFF',
  })
  const migratedText = migrated?.pages[0].elements[0]
  expect(migratedText?.kind).toBe('text')
  if (migratedText?.kind !== 'text') throw new Error('Expected migrated text.')
  expect(migratedText.appearance.backgroundFill).toEqual({
    type: 'solid',
    color: '#FFFFFF',
  })
  expect(migratedText.appearance.frame.width).toBe(1)
})

test('rejects duplicate element IDs, invalid fills and unsupported schemas', () => {
  const project = createBlankProject('Invalid')
  const first = createEditorElement({
    id: 'duplicate',
    request: { kind: 'text' },
    existingElements: [],
  })
  const second = createEditorElement({
    id: 'duplicate',
    request: { kind: 'section' },
    existingElements: [first],
  })

  const duplicateProject = {
    ...project,
    pages: [{ ...project.pages[0], elements: [first, second] }],
  }
  const invalidFillProject = {
    ...project,
    pages: [{
      ...project.pages[0],
      appearance: {
        backgroundFill: {
          type: 'linear-gradient',
          angle: 361,
          stops: ['#FFFFFF', '#000000'],
        },
      },
    }],
  }

  expect(isValidEditorProject(duplicateProject)).toBe(false)
  expect(isValidEditorProject(invalidFillProject)).toBe(false)
  expect(parseImportedEditorProject({ schemaVersion: 14, pages: [] })).toBeNull()
  expect(parseImportedEditorProject({ ...project, schemaVersion: 99 })).toBeNull()
})
