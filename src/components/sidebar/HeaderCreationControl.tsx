import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import {
  prepareImageFile,
  type PreparedImageFile,
} from '../../assets/images/prepareImageFile'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { ElementCreationRequest } from '../../model/elementCreation'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
  MAX_HEADER_SITE_NAME_LENGTH,
  MAX_HEADER_SUBTITLE_LENGTH,
  normalizeHeaderText,
} from '../../model/headerElement'
import {
  createImageAssetId,
  supportedImageMimeTypes,
  type ImageAssetId,
} from '../../model/imageAsset'
import { SidebarIcon } from './SidebarIcon'

type HeaderCreationRequest = Extract<
  ElementCreationRequest,
  { kind: 'header' }
>

type HeaderCreationControlProps = {
  onCreateHeader: (request: HeaderCreationRequest) => boolean
}

export function HeaderCreationControl({
  onCreateHeader,
}: HeaderCreationControlProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const errorId = useId()
  const [siteName, setSiteName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [preparedLogo, setPreparedLogo] = useState<PreparedImageFile | null>(null)
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { registerImageAsset, removeImageAsset } = useImageAssetStore()

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''

    if (!file) return

    setBusy(true)
    setErrorMessage(null)

    try {
      const result = await prepareImageFile(file)

      if (!mountedRef.current) return

      if (!result.ok) {
        setPreparedLogo(null)
        setErrorMessage(result.message)
        return
      }

      setPreparedLogo(result.value)
    } catch {
      if (mountedRef.current) {
        setPreparedLogo(null)
        setErrorMessage('Logoen kunne ikke behandles. Prøv en annen fil.')
      }
    } finally {
      if (mountedRef.current) setBusy(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    const normalizedSiteName = normalizeHeaderText(siteName)
    const normalizedSubtitle = normalizeHeaderText(subtitle)

    if (!isValidHeaderSiteName(normalizedSiteName)) {
      setErrorMessage('Skriv inn navn på nettsted eller firma.')
      return
    }

    if (!isValidHeaderSubtitle(normalizedSubtitle)) {
      setErrorMessage('Undertittelen er for lang.')
      return
    }

    if (!preparedLogo) {
      setErrorMessage('Velg en logo før headeren opprettes.')
      return
    }

    const assetId = createImageAssetId()
    let registeredAssetId: ImageAssetId | null = null

    try {
      if (
        !registerImageAsset(
          assetId,
          preparedLogo.file,
          preparedLogo.metadata,
        )
      ) {
        setErrorMessage('Logoen kunne ikke registreres i prosjektet.')
        return
      }

      registeredAssetId = assetId
      const created = onCreateHeader({
        kind: 'header',
        logoAssetId: assetId,
        logoAssetMetadata: preparedLogo.metadata,
        siteName: normalizedSiteName,
        subtitle: normalizedSubtitle,
      })

      if (!created) {
        removeImageAsset(assetId)
        registeredAssetId = null
        setErrorMessage('Headeren kunne ikke legges til på siden.')
        return
      }

      registeredAssetId = null
      setSiteName('')
      setSubtitle('')
      setPreparedLogo(null)
    } catch {
      if (registeredAssetId) removeImageAsset(registeredAssetId)
      setErrorMessage('Headeren kunne ikke opprettes. Prøv igjen.')
    }
  }

  return (
    <form
      className="header-creation-control"
      aria-describedby={errorMessage ? errorId : undefined}
      onSubmit={handleSubmit}
    >
      <label className="header-creation-control__field">
        <span>Navn på nettsted eller firma</span>
        <input
          type="text"
          value={siteName}
          maxLength={MAX_HEADER_SITE_NAME_LENGTH}
          required
          disabled={busy}
          onChange={(event) => setSiteName(event.currentTarget.value)}
        />
      </label>

      <label className="header-creation-control__field">
        <span>Undertittel</span>
        <input
          type="text"
          value={subtitle}
          maxLength={MAX_HEADER_SUBTITLE_LENGTH}
          disabled={busy}
          onChange={(event) => setSubtitle(event.currentTarget.value)}
        />
      </label>

      <input
        ref={inputRef}
        className="header-creation-control__file-input"
        type="file"
        accept={supportedImageMimeTypes.join(',')}
        disabled={busy}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />

      <button
        className="primary-panel-button header-creation-control__logo-button"
        type="button"
        disabled={busy}
        onClick={() => {
          setErrorMessage(null)
          inputRef.current?.click()
        }}
      >
        <SidebarIcon name="upload" />
        {busy ? 'Leser logo…' : 'Velg logo'}
      </button>

      <p className="header-creation-control__file-name">
        {preparedLogo ? preparedLogo.metadata.fileName : 'Ingen logo valgt'}
      </p>

      <button
        className="primary-panel-button header-creation-control__submit"
        type="submit"
        disabled={busy}
      >
        Opprett header
      </button>

      {errorMessage && (
        <p id={errorId} className="header-creation-control__error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}
