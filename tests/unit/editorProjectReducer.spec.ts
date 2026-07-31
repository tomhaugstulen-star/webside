import { expect, test } from '@playwright/test'
import { getElementDesktopLayout } from '../../src/model/elementLayout'
import type {
  EditorPage,
  EditorProject,
  EditorProjectState,
} from '../../src/model/editorProject'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from '../../src/state/editorProjectReducer'

const CREATED_AT = '2026-07-31T00:00:00.000Z'
const UPDATED_AT = '2026-07-31T00:01:00.000Z'

function getActivePage(state: EditorProjectState): EditorPage {
  const page = state.project.pages.find(
    (candidate) => candidate.id === state.activePageId,
  )

  if (!page) {
    throw new Error('Expected an active page in the test fixture.')
  }

  return page
}

function addTextElement(
  state: EditorProjectState,
  elementId = 'text-1',
): EditorProjectState {
  return editorProjectReducer(state, {
    type: 'add-element-to-active-page',
    elementId,
    request: { kind: 'text' },
    updatedAt: CREATED_AT,
  })
}

test.describe('editor project reducer', () => {
  test('preserves object identity for invalid selection actions', () => {
    const state = getInitialEditorProjectState()

    expect(
      editorProjectReducer(state, {
        type: 'set-active-page',
        pageId: 'missing-page',
      }),
    ).toBe(state)

    expect(
      editorProjectReducer(state, {
        type: 'set-selected-element',
        elementId: 'missing-element',
      }),
    ).toBe(state)
  })

  test('adds a valid element and rejects a duplicate element ID', () => {
    const state = getInitialEditorProjectState()
    const created = addTextElement(state)
    const activePage = getActivePage(created)

    expect(created).not.toBe(state)
    expect(activePage.elements).toHaveLength(1)
    expect(activePage.elements[0]).toMatchObject({
      id: 'text-1',
      kind: 'text',
      locked: false,
    })
    expect(created.selectedElementId).toBe('text-1')
    expect(created.project.updatedAt).toBe(CREATED_AT)

    expect(addTextElement(created)).toBe(created)
  })

  test('rejects invalid and unchanged layouts before applying a valid layout', () => {
    const created = addTextElement(getInitialEditorProjectState())
    const element = getActivePage(created).elements[0]

    if (!element) {
      throw new Error('Expected the text element to exist.')
    }

    const currentLayout = getElementDesktopLayout(element)

    expect(
      editorProjectReducer(created, {
        type: 'set-element-desktop-layout',
        elementId: element.id,
        layout: currentLayout,
        updatedAt: UPDATED_AT,
      }),
    ).toBe(created)

    expect(
      editorProjectReducer(created, {
        type: 'set-element-desktop-layout',
        elementId: element.id,
        layout: {
          ...currentLayout,
          position: { x: -1, y: currentLayout.position.y },
        },
        updatedAt: UPDATED_AT,
      }),
    ).toBe(created)

    const updated = editorProjectReducer(created, {
      type: 'set-element-desktop-layout',
      elementId: element.id,
      layout: {
        position: { x: 60, y: 80 },
        size: currentLayout.size,
      },
      updatedAt: UPDATED_AT,
    })

    expect(updated).not.toBe(created)
    expect(getActivePage(updated).elements[0]?.position.desktop).toEqual({
      x: 60,
      y: 80,
    })
    expect(updated.project.updatedAt).toBe(UPDATED_AT)
  })

  test('protects locked elements and clears selection after deletion', () => {
    const created = addTextElement(getInitialEditorProjectState())
    const locked = editorProjectReducer(created, {
      type: 'toggle-element-lock',
      elementId: 'text-1',
      updatedAt: UPDATED_AT,
    })

    expect(getActivePage(locked).elements[0]?.locked).toBe(true)
    expect(
      editorProjectReducer(locked, {
        type: 'delete-element-from-active-page',
        elementId: 'text-1',
        updatedAt: UPDATED_AT,
      }),
    ).toBe(locked)

    const unlocked = editorProjectReducer(locked, {
      type: 'toggle-element-lock',
      elementId: 'text-1',
      updatedAt: UPDATED_AT,
    })
    const deleted = editorProjectReducer(unlocked, {
      type: 'delete-element-from-active-page',
      elementId: 'text-1',
      updatedAt: UPDATED_AT,
    })

    expect(getActivePage(deleted).elements).toEqual([])
    expect(deleted.selectedElementId).toBeNull()
  })

  test('rejects a replacement project without a page', () => {
    const state = getInitialEditorProjectState()
    const invalidProject: EditorProject = {
      ...state.project,
      pages: [],
    }

    expect(() =>
      editorProjectReducer(state, {
        type: 'replace-project',
        project: invalidProject,
      }),
    ).toThrow('An editor project must contain at least one page.')
  })
})
