import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createBlankProject } from '../../src/model/createEditorProject'
import {
  isValidEditorProject,
  parseImportedEditorProject,
} from '../../src/model/editorProjectValidation'

test('accepts a current blank project', () => {
  const project = createBlankProject('Test')
  expect(isValidEditorProject(project)).toBe(true)
  expect(parseImportedEditorProject(project)).toEqual(project)
})

test('migrates a structurally valid schema 11 text element to schema 12', () => {
  const project = createBlankProject('Legacy')
  const text = createEditorElement({
    id: 'text-1',
    request: { kind: 'text' },
    existingElements: [],
  })
  if (text.kind !== 'text') throw new Error('Expected text element.')

  const legacy = {
    ...project,
    schemaVersion: 11,
    pages: [{
      ...project.pages[0],
      elements: [{
        ...text,
        appearance: {
          backgroundColor: text.appearance.backgroundColor,
        },
      }],
    }],
  }

  const migrated = parseImportedEditorProject(legacy)
  expect(migrated?.schemaVersion).toBe(12)
  const migratedText = migrated?.pages[0].elements[0]
  expect(migratedText?.kind).toBe('text')
  if (migratedText?.kind !== 'text') throw new Error('Expected migrated text.')
  expect(migratedText.appearance.frame.width).toBe(1)
})

test('rejects duplicate element IDs and malformed projects', () => {
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
    pages: [{
      ...project.pages[0],
      elements: [first, second],
    }],
  }

  expect(isValidEditorProject(duplicateProject)).toBe(false)
  expect(parseImportedEditorProject({ schemaVersion: 12, pages: [] })).toBeNull()
  expect(parseImportedEditorProject({ ...project, schemaVersion: 99 })).toBeNull()
})
