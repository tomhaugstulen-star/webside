import { createContext, type Dispatch } from 'react'
import type { EditorPage, EditorProjectState } from '../model/editorProject'
import type { EditorHistoryAction } from './editorHistoryReducer'

export type EditorProjectContextValue = {
  state: EditorProjectState
  activePage: EditorPage
  dispatch: Dispatch<EditorHistoryAction>
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
}

export const EditorProjectContext = createContext<EditorProjectContextValue | null>(null)
