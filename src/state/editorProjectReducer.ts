import { createEditorElement } from '../model/createEditorElement'
import {
  elementLayoutsEqual,
  getElementDesktopLayout,
  isValidElementLayout,
  type ElementLayout,
} from '../model/elementLayout'
import { createInitialEditorProjectState } from '../model/createEditorProject'
import type {
  EditorProject,
  EditorProjectState,
  ElementKind,
} from '../model/editorProject'

export type EditorProjectAction =
  | { type: 'replace-project'; project: EditorProject }
  | { type: 'set-active-page'; pageId: string }
  | { type: 'set-selected-element'; elementId: string | null }
  | {
      type: 'add-element-to-active-page'
      elementId: string
      kind: ElementKind
      updatedAt: string
    }
  | {
      type: 'set-element-desktop-layout'
      elementId: string
      layout: ElementLayout
      updatedAt: string
    }

export function getInitialEditorProjectState() {
  return createInitialEditorProjectState()
}

function activePageContainsElement(state: EditorProjectState, elementId: string) {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  return activePage?.elements.some((element) => element.id === elementId) ?? false
}

function projectContainsElement(state: EditorProjectState, elementId: string) {
  return state.project.pages.some((page) =>
    page.elements.some((element) => element.id === elementId),
  )
}

function selectedElementExists(state: EditorProjectState) {
  return (
    state.selectedElementId === null ||
    activePageContainsElement(state, state.selectedElementId)
  )
}

function ensureValidSelection(state: EditorProjectState): EditorProjectState {
  if (selectedElementExists(state)) {
    return state
  }

  return {
    ...state,
    selectedElementId: null,
  }
}

function reduceEditorProjectState(
  state: EditorProjectState,
  action: EditorProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'replace-project': {
      const activePageId = action.project.pages[0]?.id

      if (!activePageId) {
        throw new Error('An editor project must contain at least one page.')
      }

      return {
        project: action.project,
        activePageId,
        selectedElementId: null,
      }
    }

    case 'set-active-page': {
      if (action.pageId === state.activePageId) {
        return state
      }

      const pageExists = state.project.pages.some((page) => page.id === action.pageId)

      if (!pageExists) {
        return state
      }

      return {
        ...state,
        activePageId: action.pageId,
        selectedElementId: null,
      }
    }

    case 'set-selected-element': {
      if (action.elementId === state.selectedElementId) {
        return state
      }

      if (
        action.elementId !== null &&
        !activePageContainsElement(state, action.elementId)
      ) {
        return state
      }

      return {
        ...state,
        selectedElementId: action.elementId,
      }
    }

    case 'add-element-to-active-page': {
      const activePage = state.project.pages.find((page) => page.id === state.activePageId)

      if (!activePage || projectContainsElement(state, action.elementId)) {
        return state
      }

      const element = createEditorElement({
        id: action.elementId,
        kind: action.kind,
        existingElements: activePage.elements,
      })
      const pages = state.project.pages.map((page) =>
        page.id === state.activePageId
          ? { ...page, elements: [...page.elements, element] }
          : page,
      )

      return {
        ...state,
        project: {
          ...state.project,
          pages,
          updatedAt: action.updatedAt,
        },
        selectedElementId: element.id,
      }
    }

    case 'set-element-desktop-layout': {
      const activePage = state.project.pages.find((page) => page.id === state.activePageId)
      const element = activePage?.elements.find((candidate) => candidate.id === action.elementId)

      if (
        !activePage ||
        !element ||
        element.locked ||
        !isValidElementLayout(element.kind, action.layout) ||
        elementLayoutsEqual(getElementDesktopLayout(element), action.layout)
      ) {
        return state
      }

      const pages = state.project.pages.map((page) =>
        page.id === state.activePageId
          ? {
              ...page,
              elements: page.elements.map((candidate) =>
                candidate.id === action.elementId
                  ? {
                      ...candidate,
                      position: {
                        ...candidate.position,
                        desktop: { ...action.layout.position },
                      },
                      size: {
                        ...candidate.size,
                        desktop: { ...action.layout.size },
                      },
                    }
                  : candidate,
              ),
            }
          : page,
      )

      return {
        ...state,
        project: {
          ...state.project,
          pages,
          updatedAt: action.updatedAt,
        },
      }
    }
  }

  const unhandledAction: never = action
  return unhandledAction
}

export function editorProjectReducer(
  state: EditorProjectState,
  action: EditorProjectAction,
): EditorProjectState {
  return ensureValidSelection(reduceEditorProjectState(state, action))
}
