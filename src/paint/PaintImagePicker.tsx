import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import type { ImageAssetId } from '../model/imageAsset'

type ImageChoice = { id: ImageAssetId; resource: ImageAssetResource }

type Props = {
  images: readonly ImageChoice[]
  onChoose: (resource: ImageAssetResource) => void
  onClose: () => void
}

export function PaintImagePicker({ images, onChoose, onClose }: Props) {
  return (
    <div className="paint-backdrop" onKeyDown={(event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }}>
      <section className="paint-dialog paint-picker" role="dialog" aria-modal="true" aria-label="Velg bilde">
        <div className="paint-dialog__header">
          <h2>Velg bilde på siden</h2>
          <button type="button" onClick={onClose} autoFocus>Lukk</button>
        </div>
        {images.length ? (
          <div className="paint-picker__grid">
            {images.map(({ id, resource }) => (
              <button key={id} type="button" onClick={() => onChoose(resource)}>
                <img src={resource.objectUrl} alt="" />
                <span>{resource.file.name}</span>
              </button>
            ))}
          </div>
        ) : <p>Ingen bilder på denne siden. Legg til et bilde fra Elementer først.</p>}
      </section>
    </div>
  )
}
