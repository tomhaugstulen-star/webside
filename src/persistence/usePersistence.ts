import { useContext } from 'react'
import { PersistenceContext } from './persistenceContext'

export function usePersistence() {
  const context = useContext(PersistenceContext)

  if (!context) {
    throw new Error('usePersistence must be used inside PersistenceProvider.')
  }

  return context
}
