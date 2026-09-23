import { useMemo, useReducer, type PropsWithChildren } from 'react'
import { EditorProjectContext } from './editorProjectContext'
import {
  editorHistoryReducer,
  getInitialEditorHistoryState,
} from './editorHistoryReducer'

export function EditorProjectProvider({ children }: PropsWithChildren) {
  const [history, dispatch] = useReducer(
    editorHistoryReducer,
    undefined,
    getInitialEditorHistoryState,
  )
  const state = history.present
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)

  if (!activePage) {
    throw new Error('The active editor page does not exist in the current project.')
  }

  const value = useMemo(
    () => ({
      state,
      activePage,
      dispatch,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      undo: () => dispatch({ type: 'undo' }),
      redo: () => dispatch({ type: 'redo' }),
    }),
    [state, activePage, history.past.length, history.future.length],
  )

  return (
    <EditorProjectContext.Provider value={value}>
      {children}
    </EditorProjectContext.Provider>
  )
}
