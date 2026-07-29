import type { KeyboardEvent } from 'react'
import {
  moveElementLayout,
  resizeElementLayout,
  type ElementLayout,
} from '../../model/elementLayout'
import type { CanvasPosition, EditorElement } from '../../model/editorProject'
import {
  getImageCropSize,
  getImageTransformForResizedFrame,
  type ImageTransform,
} from '../../model/imagePresentation'

const keyboardDirections: Partial<Record<string, CanvasPosition>> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

type CanvasElementKeyboardOptions = {
  element: EditorElement
  selected: boolean
  initialLayout: ElementLayout
  canvasWidth: number
  onSelect: (elementId: string) => void
  onStartTextEditing: (elementId: string) => void
  onCommitLayout: (elementId: string, layout: ElementLayout) => void
  onCommitImageFrame: (
    elementId: string,
    layout: ElementLayout,
    transform: ImageTransform,
  ) => void
}

export function handleCanvasElementKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  {
    element,
    selected,
    initialLayout,
    canvasWidth,
    onSelect,
    onStartTextEditing,
    onCommitLayout,
    onCommitImageFrame,
  }: CanvasElementKeyboardOptions,
) {
  if (event.key === 'Enter') {
    event.preventDefault()

    if (element.kind === 'text' && selected && !element.locked) {
      onStartTextEditing(element.id)
    } else {
      onSelect(element.id)
    }

    return
  }

  if (event.key === ' ') {
    event.preventDefault()
    onSelect(element.id)
    return
  }

  const direction = keyboardDirections[event.key]

  if (!direction) {
    return
  }

  event.preventDefault()
  onSelect(element.id)

  if (element.locked || canvasWidth <= 0) {
    return
  }

  const step = event.shiftKey ? 10 : 1
  const delta = {
    x: direction.x * step,
    y: direction.y * step,
  }
  const resizing = event.ctrlKey || event.metaKey
  const maximumSize =
    element.kind === 'image' && element.mode === 'crop'
      ? getImageCropSize(element.assetMetadata, element.transform)
      : undefined
  const nextLayout = resizing
    ? resizeElementLayout(
        element.kind,
        initialLayout,
        delta,
        canvasWidth,
        'south-east',
        maximumSize,
      )
    : moveElementLayout(initialLayout, delta, canvasWidth)

  if (resizing && element.kind === 'image' && element.mode === 'crop') {
    const nextTransform = getImageTransformForResizedFrame(
      element.assetMetadata,
      initialLayout.size,
      nextLayout.size,
      element.transform,
      nextLayout.position.x - initialLayout.position.x,
      nextLayout.position.y - initialLayout.position.y,
    )
    onCommitImageFrame(element.id, nextLayout, nextTransform)
    return
  }

  onCommitLayout(element.id, nextLayout)
}
