import {
  getMinimumElementSize as getConfiguredMinimumElementSize,
  type ElementKind,
  type ElementSize,
} from './elementDimensions'
import type { CanvasPosition, EditorElement } from './editorProject'
import { getImageCropSize } from './imagePresentation'

export type ElementLayout = {
  position: CanvasPosition
  size: ElementSize
}

export type ResizeHandle =
  | 'north'
  | 'north-east'
  | 'east'
  | 'south-east'
  | 'south'
  | 'south-west'
  | 'west'
  | 'north-west'

const LAYOUT_EPSILON = 0.001

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function getElementMinimumSize(kind: ElementKind): ElementSize {
  return getConfiguredMinimumElementSize(kind)
}

export function getElementDesktopLayout(element: EditorElement): ElementLayout {
  return {
    position: element.position.desktop,
    size: element.size.desktop,
  }
}

export function moveElementLayout(
  initialLayout: ElementLayout,
  delta: CanvasPosition,
  canvasWidth: number,
): ElementLayout {
  const maximumX = Math.max(0, canvasWidth - initialLayout.size.width)

  return {
    position: {
      x: clamp(initialLayout.position.x + delta.x, 0, maximumX),
      y: Math.max(0, initialLayout.position.y + delta.y),
    },
    size: initialLayout.size,
  }
}

export function resizeElementLayout(
  kind: ElementKind,
  initialLayout: ElementLayout,
  delta: CanvasPosition,
  canvasWidth: number,
  handle: ResizeHandle = 'south-east',
  maximumSize?: ElementSize,
): ElementLayout {
  const minimumSize = getElementMinimumSize(kind)
  const maximumWidth = Math.max(
    minimumSize.width,
    maximumSize?.width ?? Number.POSITIVE_INFINITY,
  )
  const maximumHeight = Math.max(
    minimumSize.height,
    maximumSize?.height ?? Number.POSITIVE_INFINITY,
  )
  let left = initialLayout.position.x
  let top = initialLayout.position.y
  let right = left + initialLayout.size.width
  let bottom = top + initialLayout.size.height

  if (handle.includes('west')) {
    left = clamp(
      left + delta.x,
      Math.max(0, right - maximumWidth),
      right - minimumSize.width,
    )
  }

  if (handle.includes('east')) {
    right = clamp(
      right + delta.x,
      left + minimumSize.width,
      Math.min(canvasWidth, left + maximumWidth),
    )
  }

  if (handle.includes('north')) {
    top = clamp(
      top + delta.y,
      Math.max(0, bottom - maximumHeight),
      bottom - minimumSize.height,
    )
  }

  if (handle.includes('south')) {
    bottom = clamp(
      bottom + delta.y,
      top + minimumSize.height,
      top + maximumHeight,
    )
  }

  return {
    position: { x: left, y: top },
    size: {
      width: right - left,
      height: bottom - top,
    },
  }
}

export function elementLayoutsEqual(first: ElementLayout, second: ElementLayout) {
  return (
    first.position.x === second.position.x &&
    first.position.y === second.position.y &&
    first.size.width === second.size.width &&
    first.size.height === second.size.height
  )
}

export function isValidElementLayout(kind: ElementKind, layout: ElementLayout) {
  const minimumSize = getElementMinimumSize(kind)
  const values = [
    layout.position.x,
    layout.position.y,
    layout.size.width,
    layout.size.height,
  ]

  return (
    values.every(Number.isFinite) &&
    layout.position.x >= 0 &&
    layout.position.y >= 0 &&
    layout.size.width >= minimumSize.width &&
    layout.size.height >= minimumSize.height
  )
}

export function isValidElementDesktopLayout(
  element: EditorElement,
  layout: ElementLayout,
) {
  if (!isValidElementLayout(element.kind, layout)) {
    return false
  }

  if (element.kind !== 'image' || element.mode !== 'crop') {
    return true
  }

  const maximumSize = getImageCropSize(element.assetMetadata, element.transform)

  return (
    layout.size.width <= maximumSize.width + LAYOUT_EPSILON &&
    layout.size.height <= maximumSize.height + LAYOUT_EPSILON
  )
}
