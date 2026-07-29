import type { CSSProperties } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { ImageEditorElement } from '../../model/editorProject'
import {
  getImageRenderLayout,
  type ImageFrameSize,
} from '../../model/imagePresentation'
import { useImageCropTransform } from './useImageCropTransform'

type ImageElementContentProps = {
  element: ImageEditorElement
  frameSize: ImageFrameSize
  selected: boolean
  onSelect: (elementId: string) => void
}

export function ImageElementContent({
  element,
  frameSize,
  selected,
  onSelect,
}: ImageElementContentProps) {
  const { getImageAsset } = useImageAssetStore()
  const resource = getImageAsset(element.assetId)
  const {
    transform,
    dragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,
  } = useImageCropTransform({
    element,
    frameSize,
    enabled: selected && element.mode === 'crop' && !element.locked,
    onSelect,
  })

  if (!resource) {
    return (
      <span className="image-element__fallback" aria-hidden="true">
        Bildet mangler
      </span>
    )
  }

  const renderLayout = getImageRenderLayout(
    element.assetMetadata,
    frameSize,
    element.mode,
    transform,
  )
  const imageStyle: CSSProperties = renderLayout

  return (
    <div
      className={`image-element__content image-element__content--${element.mode}${dragging ? ' image-element__content--dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <img
        className="image-element__image"
        src={resource.objectUrl}
        alt={element.altText}
        draggable={false}
        style={imageStyle}
      />
    </div>
  )
}
