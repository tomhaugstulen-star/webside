import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { prepareImageFile } from '../../assets/images/prepareImageFile'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { ElementCreationRequest } from '../../model/elementCreation'
import {
  createImageAssetId,
  supportedImageMimeTypes,
  type ImageAssetId,
} from '../../model/imageAsset'
import { SidebarIcon } from './SidebarIcon'

type HeroCreationRequest = Extract<ElementCreationRequest, { kind: 'hero' }>

type HeroImportControlProps = {
  onCreateHero: (request: HeroCreationRequest) => boolean
}

export function HeroImportControl({ onCreateHero }: HeroImportControlProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const errorId = useId()
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
    let registeredAssetId: ImageAssetId | null = null

    try {
      const result = await prepareImageFile(file)
      if (!mountedRef.current) return

      if (!result.ok) {
        setErrorMessage(result.message)
        return
      }

      const assetId = createImageAssetId()
      if (
        !registerImageAsset(assetId, result.value.file, result.value.metadata)
      ) {
        setErrorMessage('Hero-bildet kunne ikke registreres i prosjektet.')
        return
      }

      registeredAssetId = assetId
      const created = onCreateHero({
        kind: 'hero',
        imageAssetId: assetId,
        imageAssetMetadata: result.value.metadata,
      })

      if (!created) {
        removeImageAsset(assetId)
        registeredAssetId = null
        setErrorMessage('Hero kunne ikke legges til på siden.')
      }
    } catch {
      if (registeredAssetId) removeImageAsset(registeredAssetId)
      if (mountedRef.current) {
        setErrorMessage('Hero-bildet kunne ikke behandles. Prøv en annen fil.')
      }
    } finally {
      if (mountedRef.current) setBusy(false)
    }
  }

  return (
    <div className="image-import-control">
      <input
        ref={inputRef}
        className="image-import-control__input"
        type="file"
        accept={supportedImageMimeTypes.join(',')}
        disabled={busy}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />
      <button
        className="element-card element-card--hero"
        type="button"
        disabled={busy}
        aria-describedby={errorMessage ? errorId : undefined}
        onClick={() => {
          setErrorMessage(null)
          inputRef.current?.click()
        }}
      >
        <SidebarIcon name="section" />
        <span>{busy ? 'Leser bilde…' : 'Hero'}</span>
      </button>
      {errorMessage && (
        <p id={errorId} className="image-import-control__error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
