import type {
  CanvasPosition,
  EditorElement,
  ElementKind,
  ElementSize,
} from './editorProject'

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

const minimumElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 160, height: 90 },
  image: { width: 120, height: 80 },
  text: { width: 120, height: 48 },
  button: { width: 80, height: 36 },
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function getElementMinimumSize(kind: ElementKind): ElementSize {
  return { ...minimumElementSizes[kind] }
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
): ElementLayout {
  const minimumSize = getElementMinimumSize(kind)
  let left = initialLayout.position.x
  let top = initialLayout.position.y
  let right = left + initialLayout.size.width
  let bottom = top + initialLayout.size.height

  if (handle.includes('west')) {
    left = clamp(left + delta.x, 0, right - minimumSize.width)
  }

  if (handle.includes('east')) {
    right = clamp(
      right + delta.x,
      left + minimumSize.width,
      canvasWidth,
    )
  }

  if (handle.includes('north')) {
    top = clamp(top + delta.y, 0, bottom - minimumSize.height)
  }

  if (handle.includes('south')) {
    bottom = Math.max(top + minimumSize.height, bottom + delta.y)
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
