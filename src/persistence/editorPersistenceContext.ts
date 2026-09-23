import { createContext } from 'react'

export type EditorPersistenceStatus =
  | 'loading'
  | 'dirty'
  | 'saving'
  | 'saved'
  | 'error'

export type EditorPersistenceContextValue = {
  status: EditorPersistenceStatus
  saveNow: () => void
}

export const EditorPersistenceContext =
  createContext<EditorPersistenceContextValue | null>(null)
