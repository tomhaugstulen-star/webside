import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from 'react'
import type { EditorPage, EditorProjectState } from '../model/editorProject'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
  type EditorProjectAction,
} from './editorProjectReducer'

type EditorProjectContextValue = {
  state: EditorProjectState
  activePage: EditorPage
  dispatch: Dispatch<EditorProjectAction>
}

const EditorProjectContext = createContext<EditorProjectContextValue | null>(null)

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

export function useEditorProject() {
  const context = useContext(EditorProjectContext)

  if (!context) {
    throw new Error('useEditorProject must be used inside EditorProjectProvider.')
  }

  return context
}
