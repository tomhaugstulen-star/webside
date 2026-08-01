import { useEffect, useState } from 'react'
import { ImageAssetStoreProvider } from '../assets/images/ImageAssetStoreProvider'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import { EditorShell } from '../components/editor/EditorShell'
import { createBlankProject } from '../model/createEditorProject'
import type { EditorProject } from '../model/editorProject'
import { EditorProjectProvider } from '../state/EditorProjectProvider'
import { PersistenceProvider } from './PersistenceProvider'
import { PersistenceRecoveryScreen } from './PersistenceRecoveryScreen'
import { readLocalProject } from './localProjectStorage'
import type { StoredImageAsset } from './localProjectTypes'

type StartupState =
  | { status: 'loading' }
  | {
      status: 'ready'
      project: EditorProject
      assets: StoredImageAsset[]
      initiallySaved: boolean
    }
  | { status: 'error'; message: string }

function LoadingScreen() {
  return (
    <main className="persistence-screen" aria-busy="true">
      <section className="persistence-screen__card">
        <h1>Åpner lokalt prosjekt</h1>
        <p>Prosjektdata og bilder kontrolleres før editoren starter.</p>
      </section>
    </main>
  )
}

function HydratedEditor({
  project,
  initiallySaved,
}: {
  project: EditorProject
  initiallySaved: boolean
}) {
  const { hydrationStatus, hydrationError } = useImageAssetStore()

  if (hydrationStatus === 'loading') {
    return <LoadingScreen />
  }

  if (hydrationStatus === 'error') {
    return (
      <PersistenceRecoveryScreen
        message={hydrationError ?? 'Lagrede bilder kunne ikke åpnes.'}
      />
    )
  }

  return (
    <EditorProjectProvider initialProject={project}>
      <PersistenceProvider initiallySaved={initiallySaved}>
        <EditorShell />
      </PersistenceProvider>
    </EditorProjectProvider>
  )
}

export function PersistentEditorApp() {
  const [startup, setStartup] = useState<StartupState>({ status: 'loading' })

  useEffect(() => {
    let active = true

    void readLocalProject().then((result) => {
      if (!active) {
        return
      }

      if (result.status === 'error') {
        setStartup({ status: 'error', message: result.message })
        return
      }

      if (result.status === 'empty') {
        setStartup({
          status: 'ready',
          project: createBlankProject(),
          assets: [],
          initiallySaved: false,
        })
        return
      }

      setStartup({
        status: 'ready',
        project: result.snapshot.envelope.project,
        assets: result.snapshot.assets,
        initiallySaved: true,
      })
    })

    return () => {
      active = false
    }
  }, [])

  if (startup.status === 'loading') {
    return <LoadingScreen />
  }

  if (startup.status === 'error') {
    return <PersistenceRecoveryScreen message={startup.message} />
  }

  return (
    <ImageAssetStoreProvider initialAssets={startup.assets}>
      <HydratedEditor
        project={startup.project}
        initiallySaved={startup.initiallySaved}
      />
    </ImageAssetStoreProvider>
  )
}
