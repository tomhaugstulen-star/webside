import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import type { ImageAssetId } from '../model/imageAsset'

type ImageChoice = { id: ImageAssetId; resource: ImageAssetResource }

type Props = {
  images: readonly ImageChoice[]
  onChoose: (resource: ImageAssetResource) => void
  onNew: () => void
  onClose: () => void
}

export function PaintImagePicker({ images, onChoose, onNew, onClose }: Props) {
  return (
    <div className="paint-backdrop" onKeyDown={(event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }}>
      <section className="paint-dialog paint-picker" role="dialog" aria-modal="true" aria-label="Velg bilde">
        <div className="paint-dialog__header">
          <div>
            <h2>Rediger bilde</h2>
            <p>Start med en tom arbeidsflate eller velg et bilde fra siden.</p>
          </div>
          <button type="button" onClick={onClose} autoFocus>Lukk</button>
        </div>
        <button type="button" className="paint-picker__new" onClick={onNew}>
          Nytt prosjekt · 1200 × 1200
        </button>
        {images.length ? (
          <div className="paint-picker__grid">
            {images.map(({ id, resource }) => (
              <button key={id} type="button" onClick={() => onChoose(resource)}>
                <img src={resource.objectUrl} alt="" />
                <span>{resource.file.name}</span>
              </button>
            ))}
          </div>
        ) : <p>Ingen bilder på denne siden. Du kan fortsatt starte et nytt prosjekt.</p>}
      </section>
    </div>
  )
}
