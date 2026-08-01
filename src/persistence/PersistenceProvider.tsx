import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import { useEditorProject } from '../state/useEditorProject'
import {
  clearLocalProject,
  writeLocalProject,
} from './localProjectStorage'
import {
  PersistenceContext,
  type PersistenceStatus,
} from './persistenceContext'

const AUTOSAVE_DELAY_MS = 650

type PersistenceProviderProps = PropsWithChildren<{
  initiallySaved: boolean
}>

export function PersistenceProvider({
  children,
  initiallySaved,
}: PersistenceProviderProps) {
  const { state } = useEditorProject()
  const { getAllImageAssets } = useImageAssetStore()
  const [status, setStatus] = useState<PersistenceStatus>(
    initiallySaved ? 'saved' : 'idle',
  )
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve())
  const saveSequenceRef = useRef(0)
  const currentProjectRef = useRef(state.project)
  const resettingRef = useRef(false)
  const firstAutosaveRef = useRef(true)

  useLayoutEffect(() => {
    currentProjectRef.current = state.project
  }, [state.project])

  const saveNow = useCallback(async () => {
    if (resettingRef.current) {
      return false
    }

    const sequence = ++saveSequenceRef.current
    const project = state.project
    const assets = getAllImageAssets()
    setStatus('saving')

    const operation = saveQueueRef.current
      .catch(() => undefined)
      .then(() => writeLocalProject(project, assets))

    saveQueueRef.current = operation

    try {
      await operation

      if (
        !resettingRef.current &&
        sequence === saveSequenceRef.current &&
        currentProjectRef.current === project
      ) {
        setStatus('saved')
      }
      return true
    } catch {
      if (
        !resettingRef.current &&
        sequence === saveSequenceRef.current &&
        currentProjectRef.current === project
      ) {
        setStatus('error')
      }
      return false
    }
  }, [getAllImageAssets, state.project])

  useEffect(() => {
    if (firstAutosaveRef.current) {
      firstAutosaveRef.current = false

      if (initiallySaved) {
        return
      }
    }

    const idleTimeoutId = window.setTimeout(() => {
      setStatus('idle')
    }, 0)
    const saveTimeoutId = window.setTimeout(() => {
      void saveNow()
    }, AUTOSAVE_DELAY_MS)

    return () => {
      window.clearTimeout(idleTimeoutId)
      window.clearTimeout(saveTimeoutId)
    }
  }, [initiallySaved, saveNow])

  const resetLocalProject = useCallback(async () => {
    resettingRef.current = true
    saveSequenceRef.current += 1
    setStatus('saving')

    try {
      await saveQueueRef.current.catch(() => undefined)
      await clearLocalProject()
      window.location.reload()
      return true
    } catch {
      resettingRef.current = false
      setStatus('error')
      return false
    }
  }, [])

  const value = useMemo(
    () => ({ status, saveNow, resetLocalProject }),
    [resetLocalProject, saveNow, status],
  )

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  )
}
