import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { prepareImageFile } from '../../assets/images/prepareImageFile'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { HeroEditorElement } from '../../model/editorProject'
import {
  createImageAssetId,
  supportedImageMimeTypes,
  type ImageAssetId,
} from '../../model/imageAsset'
import { useHeroProperties } from '../../state/useHeroProperties'

export function HeroImageProperties({
  element,
  disabled,
}: {
  element: HeroEditorElement
  disabled: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { updateHeroImage } = useHeroProperties()
  const { registerImageAsset, removeImageAsset, getImageAsset } =
    useImageAssetStore()
  const resource = getImageAsset(element.imageAssetId)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''
    if (!file) return

    setBusy(true)
    setMessage(null)
    let registeredAssetId: ImageAssetId | null = null

    try {
      const prepared = await prepareImageFile(file)
      if (!mountedRef.current) return

      if (!prepared.ok) {
        setMessage(prepared.message)
        return
      }

      const assetId = createImageAssetId()
      if (
        !registerImageAsset(assetId, prepared.value.file, prepared.value.metadata)
      ) {
        setMessage('Det nye Hero-bildet kunne ikke registreres.')
        return
      }

      registeredAssetId = assetId
      updateHeroImage(element.id, assetId, prepared.value.metadata)
      registeredAssetId = null

      setMessage('Hero-bildet er byttet.')
    } catch {
      if (registeredAssetId) removeImageAsset(registeredAssetId)
      if (mountedRef.current) {
        setMessage('Hero-bildet kunne ikke behandles. Prøv en annen fil.')
      }
    } finally {
      if (mountedRef.current) setBusy(false)
    }
  }

  return (
    <div className="hero-properties__image">
      <input
        ref={inputRef}
        className="hero-properties__file-input"
        type="file"
        accept={supportedImageMimeTypes.join(',')}
        disabled={disabled || busy}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleImageChange}
      />
      <button
        className="hero-properties__secondary"
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? 'Leser bilde…' : 'Bytt Hero-bilde'}
      </button>
      <p className="hero-properties__file-name">
        {element.imageAssetMetadata.fileName}
      </p>
      {!resource && (
        <p className="hero-properties__warning" role="alert">
          Hero-bildet mangler i den aktive ressursbufferen.
        </p>
      )}
      {message && (
        <p className="hero-properties__message" role="status">
          {message}
        </p>
      )}
    </div>
  )
}
