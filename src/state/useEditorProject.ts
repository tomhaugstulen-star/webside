import { useContext } from 'react'
import { EditorProjectContext } from './editorProjectContext'

export function useEditorProject() {
  const context = useContext(EditorProjectContext)

  if (!context) {
    throw new Error('useEditorProject must be used inside EditorProjectProvider.')
  }

  return context
}
