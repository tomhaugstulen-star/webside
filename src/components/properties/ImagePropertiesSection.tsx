import { useId, useState, type FormEvent } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { ImageEditorElement } from '../../model/editorProject'
import {
  normalizeImageAltText,
  type ImageFit,
} from '../../model/imageAsset'
import { useImageProperties } from '../../state/useImageProperties'

type ImagePropertiesSectionProps = {
  element: ImageEditorElement
}

function formatFileSize(byteSize: number) {
  const megabytes = byteSize / (1024 * 1024)
  return megabytes >= 1
    ? `${megabytes.toLocaleString('nb-NO', { maximumFractionDigits: 1 })} MB`
    : `${Math.ceil(byteSize / 1024).toLocaleString('nb-NO')} kB`
}

export function ImagePropertiesSection({
  element,
}: ImagePropertiesSectionProps) {
  const { updateImageAltText, updateImageFit } = useImageProperties()
  const { getImageAsset } = useImageAssetStore()
  const [altTextDraft, setAltTextDraft] = useState(element.altText)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const resource = getImageAsset(element.assetId)
  const idPrefix = useId()
  const titleId = `${idPrefix}-title`
  const altTextId = `${idPrefix}-alt-text`
  const fitId = `${idPrefix}-fit`
  const helpId = `${idPrefix}-alt-help`
  const disabled = element.locked

  const handleAltTextSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedAltText = normalizeImageAltText(altTextDraft)
    setAltTextDraft(normalizedAltText)

    if (normalizedAltText === element.altText) {
      setSavedMessage(null)
      return
    }

    updateImageAltText(element.id, normalizedAltText)
    setSavedMessage('Alternativ tekst er lagret.')
  }

  return (
    <section className="image-properties" aria-labelledby={titleId}>
      <h3 id={titleId}>Bilde</h3>

      <form className="image-properties__form" onSubmit={handleAltTextSubmit}>
        <label className="image-properties__field" htmlFor={altTextId}>
          <span>Alternativ tekst</span>
          <textarea
            id={altTextId}
            rows={3}
            value={altTextDraft}
            disabled={disabled}
            aria-describedby={helpId}
            onChange={(event) => {
              setAltTextDraft(event.target.value)
              setSavedMessage(null)
            }}
          />
        </label>
        <p id={helpId} className="image-properties__help">
          Beskriv innholdet kort. La feltet stå tomt når bildet er dekorativt.
        </p>
        <button
          className="image-properties__submit"
          type="submit"
          disabled={disabled}
        >
          Lagre tekst
        </button>
        {savedMessage && (
          <p className="image-properties__saved" role="status">
            {savedMessage}
          </p>
        )}
      </form>

      <label className="image-properties__field" htmlFor={fitId}>
        <span>Tilpasning</span>
        <select
          id={fitId}
          value={element.fit}
          disabled={disabled}
          onChange={(event) => {
            updateImageFit(element.id, event.target.value as ImageFit)
          }}
        >
          <option value="contain">Vis hele bildet</option>
          <option value="cover">Fyll rammen</option>
        </select>
      </label>

      <dl className="image-properties__metadata">
        <div>
          <dt>Fil</dt>
          <dd>{element.assetMetadata.fileName}</dd>
        </div>
        <div>
          <dt>Original størrelse</dt>
          <dd>
            {element.assetMetadata.width} × {element.assetMetadata.height} px
          </dd>
        </div>
        <div>
          <dt>Filstørrelse</dt>
          <dd>{formatFileSize(element.assetMetadata.byteSize)}</dd>
        </div>
      </dl>

      {!resource && (
        <p className="image-properties__warning" role="alert">
          Bildefilen finnes ikke i den aktive ressursbufferen. Elementet vises
          med kontrollert fallback.
        </p>
      )}

      {disabled && (
        <p className="image-properties__locked-note">
          Lås opp bildet for å endre alternativ tekst og tilpasning.
        </p>
      )}
    </section>
  )
}
