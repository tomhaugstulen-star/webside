import { createInitialEditorProjectState } from '../model/createEditorProject'
import type { EditorProject, EditorProjectState } from '../model/editorProject'

export type EditorProjectAction =
  | { type: 'replace-project'; project: EditorProject }
  | { type: 'set-active-page'; pageId: string }
  | { type: 'set-selected-element'; elementId: string | null }

export function getInitialEditorProjectState() {
  return createInitialEditorProjectState()
}

function selectedElementExists(state: EditorProjectState) {
  if (state.selectedElementId === null) {
    return true
  }

  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  return activePage?.elements.some((element) => element.id === state.selectedElementId) ?? false
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
      const pageExists = state.project.pages.some((page) => page.id === action.pageId)

      if (!pageExists) {
        return state
      }

      return {
        ...state,
        activePageId: action.pageId,
        selectedElementId:
          action.pageId === state.activePageId ? state.selectedElementId : null,
      }
    }

    case 'set-selected-element':
      return {
        ...state,
        selectedElementId: action.elementId,
      }
  }
}

export function editorProjectReducer(
  state: EditorProjectState,
  action: EditorProjectAction,
): EditorProjectState {
  return ensureValidSelection(reduceEditorProjectState(state, action))
}
