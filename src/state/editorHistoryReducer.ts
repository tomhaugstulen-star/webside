import type { EditorProject, EditorProjectState } from '../model/editorProject'
import type { EditorProjectAction } from './editorProjectAction'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from './editorProjectReducer'

export const EDITOR_HISTORY_LIMIT = 100

export type EditorHistoryState = {
  past: EditorProject[]
  present: EditorProjectState
  future: EditorProject[]
}

export type EditorHistoryAction =
  | EditorProjectAction
  | { type: 'undo' }
  | { type: 'redo' }

export function getInitialEditorHistoryState(): EditorHistoryState {
  return {
    past: [],
    present: getInitialEditorProjectState(),
    future: [],
  }
}

function restoreProject(
  current: EditorProjectState,
  project: EditorProject,
): EditorProjectState {
  const activePage =
    project.pages.find((page) => page.id === current.activePageId) ??
    project.pages[0]

  if (!activePage) {
    throw new Error('An editor project must contain at least one page.')
  }

  const selectedElementId =
    current.selectedElementId &&
    activePage.elements.some(
      (element) => element.id === current.selectedElementId,
    )
      ? current.selectedElementId
      : null

  return {
    project,
    activePageId: activePage.id,
    selectedElementId,
  }
}

function pushPast(
  past: readonly EditorProject[],
  project: EditorProject,
): EditorProject[] {
  const next = [...past, project]
  return next.length > EDITOR_HISTORY_LIMIT
    ? next.slice(next.length - EDITOR_HISTORY_LIMIT)
    : next
}

export function editorHistoryReducer(
  state: EditorHistoryState,
  action: EditorHistoryAction,
): EditorHistoryState {
  if (action.type === 'undo') {
    const previous = state.past.at(-1)
    if (!previous) return state

    return {
      past: state.past.slice(0, -1),
      present: restoreProject(state.present, previous),
      future: [state.present.project, ...state.future].slice(
        0,
        EDITOR_HISTORY_LIMIT,
      ),
    }
  }

  if (action.type === 'redo') {
    const next = state.future[0]
    if (!next) return state

    return {
      past: pushPast(state.past, state.present.project),
      present: restoreProject(state.present, next),
      future: state.future.slice(1),
    }
  }

  const nextPresent = editorProjectReducer(state.present, action)

  if (action.type === 'replace-project') {
    if (nextPresent === state.present) return state

    return {
      past: [],
      present: nextPresent,
      future: [],
    }
  }

  if (nextPresent.project === state.present.project) {
    if (nextPresent === state.present) return state
    return { ...state, present: nextPresent }
  }

  return {
    past: pushPast(state.past, state.present.project),
    present: nextPresent,
    future: [],
  }
}
