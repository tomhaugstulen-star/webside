import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import { createProjectFileBlob } from '../../projectFiles/createProjectFile'
import { downloadProjectBlob } from '../../projectFiles/downloadProjectBlob'
import { getProjectFileErrorMessage } from '../../projectFiles/projectFileErrorMessage'
import {
  createProjectBackupFileName,
  createProjectFileName,
  PROJECT_FILE_EXTENSION,
} from '../../projectFiles/projectFileFormat'
import { readProjectFileResult } from '../../projectFiles/readProjectFile'
import { useEditorProject } from '../../state/useEditorProject'
import { readStaticSiteZip } from '../../siteImport/readStaticSiteZip'

type BusyMode = 'export' | 'backup' | 'import' | 'site-import' | null

export function ProjectFileControls() {
  const mountedRef = useRef(true)
  const operationRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])
  const inputRef = useRef<HTMLInputElement>(null)
  const siteInputRef = useRef<HTMLInputElement>(null)
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

      downloadProjectBlob(blob, createProjectFileName(state.project.name))
      setMessage('Prosjektfilen er klar.')
    } catch {
      setMessage('Prosjektet kunne ikke eksporteres.')
    } finally {
      operationRef.current = false
      if (mountedRef.current) setBusy(null)
    }
  }

  const backupProject = async () => {
    if (operationRef.current) return
    operationRef.current = true
    setBusy('backup')
    setMessage(null)

    try {
      const blob = await createProjectFileBlob(state.project, getImageAsset)

      if (!mountedRef.current) return
      if (!blob) {
        setMessage('Sikkerhetskopien kunne ikke opprettes. Kontroller bildene.')
        return
      }

      downloadProjectBlob(
        blob,
        createProjectBackupFileName(state.project.name),
      )
      setMessage('Sikkerhetskopien er klar.')
    } catch {
      setMessage('Sikkerhetskopien kunne ikke opprettes.')
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
      const result = await readProjectFileResult(file)

      if (!mountedRef.current) return
      if (!result.ok) {
        setMessage(getProjectFileErrorMessage(result.error))
        return
      }

      const imported = result.value
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

  const importSite = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''
    if (!file || operationRef.current) return
    operationRef.current = true
    setBusy('site-import')
    setMessage(null)

    try {
      const result = await readStaticSiteZip(file)
      if (!mountedRef.current) return
      if (!result.ok) {
        setMessage(result.message)
        return
      }
      if (!replaceImageAssets(result.value.assets)) {
        setMessage('Bildene fra nettstedet kunne ikke lastes inn.')
        return
      }
      dispatch({ type: 'replace-project', project: result.value.project })
      setMessage(`Importerte nettstedet «${result.value.project.name}».`)
    } catch {
      setMessage('Nettstedet kunne ikke importeres.')
    } finally {
      operationRef.current = false
      if (mountedRef.current) setBusy(null)
    }
  }

  return (
    <section className="project-file-controls">
      <h3>Prosjektfil</h3>
      <p>
        Lagre hele prosjektet, åpne en prosjektfil eller importer en nettsted-ZIP
        som tidligere er eksportert fra editoren.
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
        <button type="button" disabled={busy !== null}
          onClick={() => siteInputRef.current?.click()}>
          {busy === 'site-import' ? 'Importerer…' : 'Importer nettsted (ZIP)'}
        </button>
        <button
          className="project-file-controls__backup"
          type="button"
          disabled={busy !== null}
          onClick={() => void backupProject()}
        >
          {busy === 'backup' ? 'Sikrer…' : 'Last ned sikkerhetskopi'}
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
      <input ref={siteInputRef} className="project-file-controls__input"
        type="file" accept=".zip,application/zip" disabled={busy !== null}
        tabIndex={-1} aria-hidden="true"
        onChange={(event) => void importSite(event)} />
      {message && <p role="status" className="project-file-controls__message">{message}</p>}
    </section>
  )
}
