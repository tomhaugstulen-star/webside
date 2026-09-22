import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createBlankProject } from '../../src/model/createEditorProject'
import { createEditorColor } from '../../src/model/editorColor'
import { DEFAULT_ELEMENT_FRAME } from '../../src/model/elementFrame'
import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorProjectState,
} from '../../src/model/editorProject'
import {
  migrateEditorProjectV11,
  type EditorProjectV11,
} from '../../src/model/editorProjectMigration'
import { editorProjectReducer } from '../../src/state/editorProjectReducer'

function createTextElement(id = 'text-1') {
  const element = createEditorElement({
    id,
    request: { kind: 'text' },
    existingElements: [],
  })

  if (element.kind !== 'text') throw new Error('Expected text element.')
  return element
}

test.describe('editor polish frames', () => {
  test('uses one pixel as the default frame for framed elements', () => {
    const text = createTextElement()
    const section = createEditorElement({
      id: 'section-1',
      request: { kind: 'section' },
      existingElements: [],
    })

    expect(DEFAULT_ELEMENT_FRAME.width).toBe(1)
    expect(text.appearance.frame.width).toBe(1)
    expect(section.kind === 'section' && section.appearance.frame.width).toBe(1)
  })

  test('updates text frame width and color through reducer actions', () => {
    const project = createBlankProject('Ramme')
    let state: EditorProjectState = {
      project,
      activePageId: project.pages[0].id,
      selectedElementId: null,
    }

    state = editorProjectReducer(state, {
      type: 'add-element-to-active-page',
      elementId: 'text-1',
      request: { kind: 'text' },
      updatedAt: '2026-08-14T00:00:00.000Z',
    })
    state = editorProjectReducer(state, {
      type: 'set-text-frame-width',
      elementId: 'text-1',
      width: 0,
      updatedAt: '2026-08-14T00:00:01.000Z',
    })
    state = editorProjectReducer(state, {
      type: 'set-text-frame-color',
      elementId: 'text-1',
      color: createEditorColor('#123456'),
      updatedAt: '2026-08-14T00:00:02.000Z',
    })

    const text = state.project.pages[0].elements[0]
    expect(text.kind === 'text' && text.appearance.frame).toEqual({
      width: 0,
      color: '#123456',
    })
  })

  test('migrates schema 11 text appearance to schema 12 deterministically', () => {
    const project = createBlankProject('Migrering')
    const text = createTextElement('legacy-text')
    const legacy: EditorProjectV11 = {
      ...project,
      schemaVersion: 11,
      pages: [
        {
          ...project.pages[0],
          elements: [
            {
              ...text,
              appearance: {
                backgroundColor: text.appearance.backgroundColor,
              },
            },
          ],
        },
      ],
    }

    const first = migrateEditorProjectV11(legacy)
    const second = migrateEditorProjectV11(legacy)
    const migratedText = first.pages[0].elements[0]

    expect(first).toEqual(second)
    expect(first.schemaVersion).toBe(EDITOR_PROJECT_SCHEMA_VERSION)
    expect(migratedText.kind === 'text' && migratedText.appearance.frame).toEqual(
      DEFAULT_ELEMENT_FRAME,
    )
  })
})
