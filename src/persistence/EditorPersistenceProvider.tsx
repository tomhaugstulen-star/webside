import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import { createBlankProject } from '../model/createEditorProject'
import type { EditorProject } from '../model/editorProject'
import { useEditorProject } from '../state/useEditorProject'
import { createLocalProjectSnapshot } from './createLocalProjectSnapshot'
import {
  EditorPersistenceContext,
  type EditorPersistenceStatus,
} from './editorPersistenceContext'
import { indexedDbLocalProjectStorage } from './indexedDbLocalProjectStorage'
import type { LocalProjectStorage } from './localProjectStorage'

const AUTOSAVE_DELAY_MS = 750

type EditorPersistenceProviderProps = PropsWithChildren<{
  storage?: LocalProjectStorage
}>

export function EditorPersistenceProvider({
  children,
  storage = indexedDbLocalProjectStorage,
}: EditorPersistenceProviderProps) {
  const { state, dispatch } = useEditorProject()
  const { getImageAsset, replaceImageAssets } = useImageAssetStore()
  const [status, setStatus] = useState<EditorPersistenceStatus>('loading')
  const [bootError, setBootError] = useState(false)
  const [resetting, setResetting] = useState(false)
  const latestProjectRef = useRef(state.project)
  const lastSavedProjectRef = useRef<EditorProject | null>(null)
  const saveTimerRef = useRef<number | null>(null)
  const pendingSaveRef = useRef<EditorProject | null>(null)
  const savingRef = useRef(false)
  const bootedRef = useRef(false)
  const restorePromiseRef = useRef<ReturnType<LocalProjectStorage['load']> | null>(
    null,
  )

  latestProjectRef.current = state.project

  const saveProject = useCallback(
    async (project: EditorProject) => {
      pendingSaveRef.current = project
      if (savingRef.current) return

      savingRef.current = true

      while (pendingSaveRef.current) {
        const target = pendingSaveRef.current
        pendingSaveRef.current = null
        const snapshot = createLocalProjectSnapshot(target, getImageAsset)

        if (!snapshot) {
          setStatus('error')
          savingRef.current = false
          return
        }

        setStatus('saving')

        try {
          await storage.save(snapshot)
          lastSavedProjectRef.current = target
        } catch {
          setStatus('error')
          savingRef.current = false
          return
        }
      }

      savingRef.current = false
      setStatus(
        latestProjectRef.current === lastSavedProjectRef.current
          ? 'saved'
          : 'dirty',
      )
    },
    [getImageAsset, storage],
  )

  const saveNow = useCallback(() => {
    if (!bootedRef.current || bootError) return
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    void saveProject(latestProjectRef.current)
  }, [bootError, saveProject])

  useEffect(() => {
    let active = true
    const restorePromise =
      restorePromiseRef.current ?? (restorePromiseRef.current = storage.load())

    void restorePromise
      .then((snapshot) => {
        if (!active) return

        if (snapshot) {
          if (!replaceImageAssets(snapshot.assets)) {
            throw new Error('Local image assets could not be restored.')
          }
          lastSavedProjectRef.current = snapshot.project
          dispatch({ type: 'replace-project', project: snapshot.project })
        } else {
          lastSavedProjectRef.current = latestProjectRef.current
        }

        bootedRef.current = true
        setStatus('saved')
      })
      .catch(() => {
        if (!active) return
        setBootError(true)
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [dispatch, replaceImageAssets, storage])

  useEffect(() => {
    if (
      !bootedRef.current ||
      bootError ||
      state.project === lastSavedProjectRef.current
    ) {
      return
    }

    setStatus('dirty')
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null
      void saveProject(latestProjectRef.current)
    }, AUTOSAVE_DELAY_MS)

    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
    }
  }, [bootError, saveProject, state.project])

  const resetLocalProject = async () => {
    if (
      !window.confirm(
        'Slette det lokale prosjektet og starte med et nytt tomt prosjekt?',
      )
    ) {
      return
    }

    setResetting(true)

    try {
      await storage.clear()
      if (!replaceImageAssets([])) {
        throw new Error('Image asset reset failed.')
      }

      const project = createBlankProject()
      lastSavedProjectRef.current = null
      restorePromiseRef.current = Promise.resolve(null)
      dispatch({ type: 'replace-project', project })
      bootedRef.current = true
      setBootError(false)
      setStatus('dirty')
    } catch {
      setStatus('error')
    } finally {
      setResetting(false)
    }
  }

  const value = useMemo(
    () => ({ status, saveNow }),
    [saveNow, status],
  )

  if (status === 'loading') {
    return (
      <main className="persistence-gate" aria-live="polite">
        <h1>Website</h1>
        <p>Laster lokalt prosjekt…</p>
      </main>
    )
  }

  if (bootError) {
    return (
      <main className="persistence-gate persistence-gate--error">
        <h1>Lokalt prosjekt kunne ikke åpnes</h1>
        <p>
          De lagrede dataene er beholdt. Start et nytt lokalt prosjekt bare
          hvis du vil nullstille den lokale lagringen.
        </p>
        <button
          type="button"
          disabled={resetting}
          onClick={() => void resetLocalProject()}
        >
          {resetting ? 'Nullstiller…' : 'Start nytt lokalt prosjekt'}
        </button>
      </main>
    )
  }

  return (
    <EditorPersistenceContext.Provider value={value}>
      {children}
    </EditorPersistenceContext.Provider>
  )
}
