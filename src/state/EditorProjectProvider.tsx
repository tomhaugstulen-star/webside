import { useMemo, useReducer, type PropsWithChildren } from 'react'
import type { EditorProject, EditorProjectState } from '../model/editorProject'
import { EditorProjectContext } from './editorProjectContext'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from './editorProjectReducer'

type EditorProjectProviderProps = PropsWithChildren<{
  initialProject?: EditorProject
}>

function createProviderState(
  initialProject: EditorProject | undefined,
): EditorProjectState {
  if (!initialProject) {
    return getInitialEditorProjectState()
  }

  const activePageId = initialProject.pages[0]?.id

  if (!activePageId) {
    throw new Error('An editor project must contain at least one page.')
  }

  return {
    project: initialProject,
    activePageId,
    selectedElementId: null,
  }
}

export function EditorProjectProvider({
  children,
  initialProject,
}: EditorProjectProviderProps) {
  const [state, dispatch] = useReducer(
    editorProjectReducer,
    initialProject,
    createProviderState,
  )

  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )

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
