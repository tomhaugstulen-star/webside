import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createBlankProject } from '../../src/model/createEditorProject'
import {
  isValidEditorProject,
  parseImportedEditorProject,
} from '../../src/model/editorProjectValidation'

test('accepts a current blank project', () => {
  const project = createBlankProject('Test')
  expect(project.schemaVersion).toBe(14)
  expect(isValidEditorProject(project)).toBe(true)
  expect(parseImportedEditorProject(project)).toEqual(project)
})

test('migrates schema 12 solid backgrounds to schema 14 fills', () => {
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
  expect(migrated?.schemaVersion).toBe(14)
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
