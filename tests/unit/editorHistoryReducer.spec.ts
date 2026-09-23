import { expect, test } from '@playwright/test'
import { createBlankProject } from '../../src/model/createEditorProject'
import {
  EDITOR_HISTORY_LIMIT,
  editorHistoryReducer,
  getInitialEditorHistoryState,
} from '../../src/state/editorHistoryReducer'

const AT = '2026-09-23T13:30:00.000Z'

function addText() {
  return editorHistoryReducer(getInitialEditorHistoryState(), {
    type: 'add-element-to-active-page',
    elementId: 'text-1',
    request: { kind: 'text' },
    updatedAt: AT,
  })
}

test('records project mutations but not transient or rejected actions', () => {
  const created = addText()
  expect(created.past).toHaveLength(1)
  expect(created.future).toHaveLength(0)

  const selected = editorHistoryReducer(created, {
    type: 'set-selected-element',
    elementId: null,
  })
  expect(selected.past).toHaveLength(1)
  expect(selected.present.project).toBe(created.present.project)

  const rejected = editorHistoryReducer(selected, {
    type: 'set-selected-element',
    elementId: 'missing',
  })
  expect(rejected).toBe(selected)

  const unchanged = editorHistoryReducer(selected, {
    type: 'set-text-element-content',
    elementId: 'text-1',
    content: '',
    updatedAt: AT,
  })
  expect(unchanged).toBe(selected)
})

test('undo and redo restore project mutations and keep transient state valid', () => {
  const created = addText()
  const edited = editorHistoryReducer(created, {
    type: 'set-text-element-content',
    elementId: 'text-1',
    content: 'Ny tekst',
    updatedAt: AT,
  })

  const undone = editorHistoryReducer(edited, { type: 'undo' })
  expect(undone.past).toHaveLength(1)
  expect(undone.future).toHaveLength(1)
  expect(undone.present.project.pages[0].elements[0]).toMatchObject({
    kind: 'text',
    content: '',
  })

  const redone = editorHistoryReducer(undone, { type: 'redo' })
  expect(redone.future).toHaveLength(0)
  expect(redone.present.project.pages[0].elements[0]).toMatchObject({
    kind: 'text',
    content: 'Ny tekst',
  })
})

test('a new mutation after undo clears the redo branch', () => {
  const created = addText()
  const firstEdit = editorHistoryReducer(created, {
    type: 'set-text-element-content',
    elementId: 'text-1',
    content: 'Første',
    updatedAt: AT,
  })
  const undone = editorHistoryReducer(firstEdit, { type: 'undo' })
  expect(undone.future).toHaveLength(1)

  const alternateEdit = editorHistoryReducer(undone, {
    type: 'set-text-element-content',
    elementId: 'text-1',
    content: 'Alternativ',
    updatedAt: AT,
  })

  expect(alternateEdit.future).toHaveLength(0)
  expect(alternateEdit.present.project.pages[0].elements[0]).toMatchObject({
    kind: 'text',
    content: 'Alternativ',
  })
})

test('replace-project starts a new history base', () => {
  const created = addText()
  const importedProject = createBlankProject('Importert prosjekt')
  const replaced = editorHistoryReducer(created, {
    type: 'replace-project',
    project: importedProject,
  })

  expect(replaced.past).toEqual([])
  expect(replaced.future).toEqual([])
  expect(replaced.present.project).toBe(importedProject)
  expect(editorHistoryReducer(replaced, { type: 'undo' })).toBe(replaced)
})

test('history retains only the latest 100 project states', () => {
  let history = addText()

  for (let index = 1; index <= EDITOR_HISTORY_LIMIT + 8; index += 1) {
    history = editorHistoryReducer(history, {
      type: 'set-text-element-content',
      elementId: 'text-1',
      content: `Tekst ${index}`,
      updatedAt: `2026-09-23T13:30:${String(index % 60).padStart(2, '0')}.000Z`,
    })
  }

  expect(history.past).toHaveLength(EDITOR_HISTORY_LIMIT)

  for (let index = 0; index < EDITOR_HISTORY_LIMIT; index += 1) {
    history = editorHistoryReducer(history, { type: 'undo' })
  }

  expect(history.past).toEqual([])
  expect(history.future).toHaveLength(EDITOR_HISTORY_LIMIT)
  expect(history.present.project.pages[0].elements[0]).toMatchObject({
    kind: 'text',
    content: 'Tekst 8',
  })
})
