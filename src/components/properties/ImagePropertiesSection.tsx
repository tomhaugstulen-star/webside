import { useId, useState, type FormEvent } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { ImageEditorElement } from '../../model/editorProject'
import { normalizeImageAltText } from '../../model/imageAsset'
import {
  DEFAULT_IMAGE_TRANSFORM,
  MAX_IMAGE_ZOOM,
  MIN_IMAGE_ZOOM,
  type ImageMode,
} from '../../model/imagePresentation'
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
  const {
    updateImageAltText,
    updateImageMode,
    updateImageTransform,
  } = useImageProperties()
  const { getImageAsset } = useImageAssetStore()
  const [altTextDraft, setAltTextDraft] = useState(element.altText)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const resource = getImageAsset(element.assetId)
  const idPrefix = useId()
  const titleId = `${idPrefix}-title`
  const altTextId = `${idPrefix}-alt-text`
  const helpId = `${idPrefix}-alt-help`
  const cropHelpId = `${idPrefix}-crop-help`
  const disabled = element.locked
  const zoomPercent = Math.round(element.transform.zoom * 100)

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

  const selectMode = (mode: ImageMode) => {
    updateImageMode(element.id, mode)
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

      <fieldset className="image-properties__mode" disabled={disabled}>
        <legend>Visning</legend>
        <label>
          <input
            type="radio"
            name={`${idPrefix}-mode`}
            value="contain"
            checked={element.mode === 'contain'}
            onChange={() => selectMode('contain')}
          />
          <span>Hele bildet</span>
        </label>
        <label>
          <input
            type="radio"
            name={`${idPrefix}-mode`}
            value="crop"
            checked={element.mode === 'crop'}
            onChange={() => selectMode('crop')}
          />
          <span>Juster utsnitt</span>
        </label>
      </fieldset>

      {element.mode === 'crop' && (
        <div className="image-properties__crop-controls">
          <label className="image-properties__zoom">
            <span>
              Zoom <output>{zoomPercent} %</output>
            </span>
            <input
              type="range"
              min={MIN_IMAGE_ZOOM}
              max={MAX_IMAGE_ZOOM}
              step="0.05"
              value={element.transform.zoom}
              disabled={disabled}
              aria-describedby={cropHelpId}
              onChange={(event) =>
                updateImageTransform(element.id, {
                  ...element.transform,
                  zoom: Number(event.target.value),
                })
              }
            />
          </label>
          <p id={cropHelpId} className="image-properties__help">
            Dra motivet inne i rammen. Rammegrepene endrer bare det synlige området.
          </p>
          <button
            className="image-properties__reset"
            type="button"
            disabled={disabled}
            onClick={() =>
              updateImageTransform(element.id, { ...DEFAULT_IMAGE_TRANSFORM })
            }
          >
            Tilbakestill utsnitt
          </button>
        </div>
      )}

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
          Lås opp bildet for å endre tekst, ramme og utsnitt.
        </p>
      )}
    </section>
  )
}
