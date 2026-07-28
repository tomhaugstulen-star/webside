import { createContext, type Dispatch } from 'react'
import type { EditorPage, EditorProjectState } from '../model/editorProject'
import type { EditorProjectAction } from './editorProjectReducer'

export type EditorProjectContextValue = {
  state: EditorProjectState
  activePage: EditorPage
  dispatch: Dispatch<EditorProjectAction>
}

export const EditorProjectContext = createContext<EditorProjectContextValue | null>(null)
