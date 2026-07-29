import type { CSSProperties } from 'react'
import { buttonAssetCatalog } from '../../assets/buttons/buttonAssetCatalog'
import type { ButtonAssetId } from '../../model/buttonAsset'

type ButtonLibraryPanelProps = {
  onBack: () => void
  onCreateButton: (assetId: ButtonAssetId) => void
}

type ButtonPreviewStyle = CSSProperties & {
  '--button-library-label-color': string
}

export function ButtonLibraryPanel({
  onBack,
  onCreateButton,
}: ButtonLibraryPanelProps) {
  return (
    <>
      <div className="button-library-header">
        <button
          className="button-library-back"
          type="button"
          onClick={onBack}
        >
          Tilbake
        </button>
        <h2>Knapp</h2>
      </div>

      <p className="panel-intro">
        Velg et design for å legge til en knapp på siden.
      </p>

      <div className="button-library-grid">
        {buttonAssetCatalog.map((asset) => {
          const previewStyle: ButtonPreviewStyle = {
            '--button-library-label-color': asset.labelColor,
          }

          return (
            <button
              key={asset.id}
              className="button-library-card"
              type="button"
              aria-label={`Legg til ${asset.name}`}
              onClick={() => onCreateButton(asset.id)}
            >
              <span
                className="button-library-preview"
                style={previewStyle}
                aria-hidden="true"
              >
                <img
                  src={asset.src}
                  alt=""
                  draggable={false}
                />
                <span>Les mer</span>
              </span>
              <strong>{asset.name}</strong>
            </button>
          )
        })}
      </div>
    </>
  )
}
