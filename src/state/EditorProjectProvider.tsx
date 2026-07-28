import { useMemo, useReducer, type PropsWithChildren } from 'react'
import { EditorProjectContext } from './editorProjectContext'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from './editorProjectReducer'

export function EditorProjectProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    editorProjectReducer,
    undefined,
    getInitialEditorProjectState,
  )

  const activePage = state.project.pages.find((page) => page.id === state.activePageId)

  if (!activePage) {
    throw new Error('The active editor page does not exist in the current project.')
  }

  const value = useMemo(
    () => ({ state, activePage, dispatch }),
    [state, activePage],
  )

  return (
    <EditorProjectContext.Provider value={value}>
      {children}
    </EditorProjectContext.Provider>
  )
}
