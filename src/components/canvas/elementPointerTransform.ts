import {
  moveElementLayout,
  resizeElementLayout,
  type ElementLayout,
  type ResizeHandle,
} from '../../model/elementLayout'
import type { CanvasPosition, EditorElement } from '../../model/editorProject'
import {
  getImageCropSize,
  getImageTransformForResizedFrame,
  type ImageTransform,
} from '../../model/imagePresentation'

export type TransformMode = 'move' | 'resize'

export type PointerInteraction = {
  pointerId: number
  mode: TransformMode
  resizeHandle: ResizeHandle
  startClientX: number
  startClientY: number
  startScrollLeft: number
  startScrollTop: number
  canvasWidth: number
  initialLayout: ElementLayout
}

export function getPointerInteractionDelta(
  interaction: PointerInteraction,
  clientX: number,
  clientY: number,
  scrollLeft: number,
  scrollTop: number,
): CanvasPosition {
  return {
    x:
      clientX -
      interaction.startClientX +
      scrollLeft -
      interaction.startScrollLeft,
    y:
      clientY -
      interaction.startClientY +
      scrollTop -
      interaction.startScrollTop,
  }
}

export function getNextPointerLayout(
  element: EditorElement,
  interaction: PointerInteraction,
  delta: CanvasPosition,
): ElementLayout {
  if (interaction.mode === 'move') {
    return moveElementLayout(
      interaction.initialLayout,
      delta,
      interaction.canvasWidth,
    )
  }

  const maximumSize =
    element.kind === 'image' && element.mode === 'crop'
      ? getImageCropSize(element.assetMetadata, element.transform)
      : undefined

  return resizeElementLayout(
    element.kind,
    interaction.initialLayout,
    delta,
    interaction.canvasWidth,
    interaction.resizeHandle,
    maximumSize,
  )
}

export function getResizedImageTransform(
  element: EditorElement,
  initialLayout: ElementLayout,
  layout: ElementLayout,
): ImageTransform | null {
  if (element.kind !== 'image' || element.mode !== 'crop') {
    return null
  }

  return getImageTransformForResizedFrame(
    element.assetMetadata,
    initialLayout.size,
    layout.size,
    element.transform,
    layout.position.x - initialLayout.position.x,
    layout.position.y - initialLayout.position.y,
  )
}
