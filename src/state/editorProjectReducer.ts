import { createInitialEditorProjectState } from '../model/createEditorProject'
import type {
  EditorElement,
  EditorProject,
  EditorProjectState,
} from '../model/editorProject'

export type EditorProjectAction =
  | { type: 'replace-project'; project: EditorProject }
  | { type: 'set-active-page'; pageId: string }
  | { type: 'set-selected-element'; elementId: string | null }
  | { type: 'add-element-to-active-page'; element: EditorElement; updatedAt: string }

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
      if (projectContainsElement(state, action.element.id)) {
        return state
      }

      const pages = state.project.pages.map((page) =>
        page.id === state.activePageId
          ? { ...page, elements: [...page.elements, action.element] }
          : page,
      )

      return {
        ...state,
        project: {
          ...state.project,
          pages,
          updatedAt: action.updatedAt,
        },
        selectedElementId: action.element.id,
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
