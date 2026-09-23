import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { prepareImageFile } from '../../assets/images/prepareImageFile'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { HeaderEditorElement } from '../../model/editorProject'
import {
  createImageAssetId,
  supportedImageMimeTypes,
  type ImageAssetId,
} from '../../model/imageAsset'
import { projectReferencesImageAsset } from '../../model/projectImageAssets'
import { useEditorProject } from '../../state/useEditorProject'
import { useHeaderProperties } from '../../state/useHeaderProperties'

export function HeaderLogoProperties({
  element,
}: {
  element: HeaderEditorElement
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { state } = useEditorProject()
  const { updateHeaderLogo } = useHeaderProperties()
  const { registerImageAsset, removeImageAsset, getImageAsset } =
    useImageAssetStore()
  const resource = getImageAsset(element.logoAssetId)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
        setMessage('Den nye logoen kunne ikke registreres.')
        return
      }

      registeredAssetId = assetId
      const previousAssetId = element.logoAssetId
      const previousStillReferenced = projectReferencesImageAsset(
        state.project,
        previousAssetId,
        element.id,
      )

      updateHeaderLogo(element.id, assetId, prepared.value.metadata)
      registeredAssetId = null

      if (!previousStillReferenced) removeImageAsset(previousAssetId)
      setMessage('Logoen er byttet.')
    } catch {
      if (registeredAssetId) removeImageAsset(registeredAssetId)
      if (mountedRef.current) {
        setMessage('Logoen kunne ikke behandles. Prøv en annen fil.')
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
        disabled={element.locked || busy}
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleLogoChange}
      />
      <button
        className="hero-properties__secondary"
        type="button"
        disabled={element.locked || busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? 'Leser logo…' : 'Bytt logo'}
      </button>
      <p className="hero-properties__file-name">
        {element.logoAssetMetadata.fileName}
      </p>
      {!resource && (
        <p className="hero-properties__warning" role="alert">
          Logoen mangler i den aktive ressursbufferen.
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
