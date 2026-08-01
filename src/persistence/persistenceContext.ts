import { createContext } from 'react'

export type PersistenceStatus = 'idle' | 'saving' | 'saved' | 'error'

export type PersistenceContextValue = {
  status: PersistenceStatus
  saveNow: () => Promise<boolean>
  resetLocalProject: () => Promise<boolean>
}

export const PersistenceContext =
  createContext<PersistenceContextValue | null>(null)
