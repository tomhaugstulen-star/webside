import { useRef, useState, type ChangeEvent } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import { prepareImageFile } from '../../assets/images/prepareImageFile'
import type { ElementCreationRequest } from '../../model/elementCreation'
import {
  createImageAssetId,
  supportedImageMimeTypes,
} from '../../model/imageAsset'
import { SidebarIcon } from './SidebarIcon'

type ImageCreationRequest = Extract<ElementCreationRequest, { kind: 'image' }>

type ImageImportControlProps = {
  onCreateImage: (request: ImageCreationRequest) => boolean
}

export function ImageImportControl({
  onCreateImage,
}: ImageImportControlProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { registerImageAsset, removeImageAsset } = useImageAssetStore()

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''

    if (!file) {
      return
    }

    setBusy(true)
    setErrorMessage(null)
    const result = await prepareImageFile(file)

    if (!result.ok) {
      setErrorMessage(result.message)
      setBusy(false)
      return
    }

    const assetId = createImageAssetId()

    if (!registerImageAsset(assetId, result.value.file, result.value.metadata)) {
      setErrorMessage('Bildet kunne ikke registreres i prosjektet.')
      setBusy(false)
      return
    }

    const created = onCreateImage({
      kind: 'image',
      assetId,
      assetMetadata: result.value.metadata,
    })

    if (!created) {
      removeImageAsset(assetId)
      setErrorMessage('Bildet kunne ikke legges til på siden.')
      setBusy(false)
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
        aria-label="Velg bildefil"
        onChange={handleFileChange}
      />
      <button
        className="element-card"
        type="button"
        disabled={busy}
        aria-describedby={errorMessage ? 'image-import-error' : undefined}
        onClick={() => {
          setErrorMessage(null)
          inputRef.current?.click()
        }}
      >
        <SidebarIcon name="image" />
        <span>{busy ? 'Leser bilde…' : 'Bilde'}</span>
      </button>
      {errorMessage && (
        <p id="image-import-error" className="image-import-control__error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
