import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import { createProjectFileBlob } from '../../projectFiles/createProjectFile'
import {
  createProjectFileName,
  PROJECT_FILE_EXTENSION,
} from '../../projectFiles/projectFileFormat'
import { readProjectFile } from '../../projectFiles/readProjectFile'
import { useEditorProject } from '../../state/useEditorProject'

type BusyMode = 'export' | 'import' | null

export function ProjectFileControls() {
  const mountedRef = useRef(true)
  const operationRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<BusyMode>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { state, dispatch } = useEditorProject()
  const { getImageAsset, replaceImageAssets } = useImageAssetStore()

  const exportProject = async () => {
    if (operationRef.current) return
    operationRef.current = true
    setBusy('export')
    setMessage(null)

    try {
      const blob = await createProjectFileBlob(state.project, getImageAsset)

      if (!mountedRef.current) return
      if (!blob) {
        setMessage('Prosjektet kunne ikke eksporteres. Kontroller bildene.')
        return
      }

      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = createProjectFileName(state.project.name)
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
      setMessage('Prosjektfilen er klar.')
    } catch {
      setMessage('Prosjektet kunne ikke eksporteres.')
    } finally {
      operationRef.current = false
      if (mountedRef.current) setBusy(null)
    }
  }

  const importProject = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''

    if (!file || operationRef.current) return
    operationRef.current = true

    setBusy('import')
    setMessage(null)

    try {
      const imported = await readProjectFile(file)

      if (!mountedRef.current) return
      if (!imported) {
        setMessage('Prosjektfilen er ugyldig eller skadet.')
        return
      }

      if (!replaceImageAssets(imported.assets)) {
        setMessage('Bildene i prosjektfilen kunne ikke lastes inn.')
        return
      }

      dispatch({ type: 'replace-project', project: imported.project })
      setMessage(`Åpnet «${imported.project.name}».`)
    } catch {
      setMessage('Prosjektfilen kunne ikke åpnes.')
    } finally {
      operationRef.current = false
      if (mountedRef.current) setBusy(null)
    }
  }

  return (
    <section className="project-file-controls">
      <h3>Prosjektfil</h3>
      <p>
        Lagre hele prosjektet med bilder, eller åpne en tidligere prosjektfil.
      </p>
      <div className="project-file-controls__actions">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void exportProject()}
        >
          {busy === 'export' ? 'Lagrer…' : 'Lagre prosjektfil'}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => inputRef.current?.click()}
        >
          {busy === 'import' ? 'Åpner…' : 'Åpne prosjekt'}
        </button>
      </div>
      <input
        ref={inputRef}
        className="project-file-controls__input"
        type="file"
        accept={PROJECT_FILE_EXTENSION}
        disabled={busy !== null}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => void importProject(event)}
      />
      {message && <p role="status" className="project-file-controls__message">{message}</p>}
    </section>
  )
}
