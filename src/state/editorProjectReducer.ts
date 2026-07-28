import { createInitialEditorProjectState } from '../model/createEditorProject'
import type { EditorProject, EditorProjectState } from '../model/editorProject'

export type EditorProjectAction =
  | { type: 'replace-project'; project: EditorProject }
  | { type: 'set-active-page'; pageId: string }

export function getInitialEditorProjectState() {
  return createInitialEditorProjectState()
}

export function editorProjectReducer(
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
      }
    }
  }
}
