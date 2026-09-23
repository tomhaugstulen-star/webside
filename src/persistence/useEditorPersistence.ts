import { useContext } from 'react'
import { EditorPersistenceContext } from './editorPersistenceContext'

export function useEditorPersistence() {
  const context = useContext(EditorPersistenceContext)

  if (!context) {
    throw new Error(
      'useEditorPersistence must be used inside EditorPersistenceProvider.',
    )
  }

  return context
}
