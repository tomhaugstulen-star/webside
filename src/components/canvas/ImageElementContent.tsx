import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { ImageEditorElement } from '../../model/editorProject'

type ImageElementContentProps = {
  element: ImageEditorElement
}

export function ImageElementContent({ element }: ImageElementContentProps) {
  const { getImageAsset } = useImageAssetStore()
  const resource = getImageAsset(element.assetId)

  if (!resource) {
    return (
      <span className="image-element__fallback" aria-hidden="true">
        Bildet mangler
      </span>
    )
  }

  return (
    <img
      className="image-element__image"
      src={resource.objectUrl}
      alt={element.altText}
      draggable={false}
      style={{ objectFit: element.fit }}
    />
  )
}
