import {
  HEADER_SERIALIZED_WIDTH,
  getMinimumElementSize,
} from './elementDimensions'
import type {
  EditorElement,
  ResponsiveViewport,
} from './editorProject'
import type { ElementLayout } from './elementLayout'
import { normalizeContainedImageLayout } from './containedImageLayout'

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function getInheritedMobileSize(
  element: EditorElement,
  canvasWidth: number,
) {
  const desktopSize = element.size.desktop

  if (canvasWidth <= 0 || desktopSize.width <= canvasWidth) {
    return { ...desktopSize }
  }

  const minimumSize = getMinimumElementSize(element.kind)
  const width = Math.max(minimumSize.width, canvasWidth)

  if (element.kind !== 'image' && element.kind !== 'hero') {
    return { width, height: desktopSize.height }
  }

  const scale = canvasWidth / desktopSize.width
  return {
    width,
    height: Math.max(
      minimumSize.height,
      Math.round(desktopSize.height * scale),
    ),
  }
}

function getInheritedMobilePosition(
  element: EditorElement,
  mobileWidth: number,
) {
  const desktopPosition = element.position.desktop
  const desktopWidth = Math.min(
    element.size.desktop.width,
    HEADER_SERIALIZED_WIDTH,
  )
  const desktopTravel = Math.max(0, HEADER_SERIALIZED_WIDTH - desktopWidth)
  const mobileTravel = Math.max(0, mobileWidth)

  if (desktopTravel === 0) {
    return { x: 0, y: desktopPosition.y }
  }

  const relativeX = clamp(desktopPosition.x / desktopTravel, 0, 1)

  return {
    x: Math.round(relativeX * mobileTravel),
    y: desktopPosition.y,
  }
}

export function resolveResponsiveElementLayout(
  element: EditorElement,
  viewport: ResponsiveViewport,
  canvasWidth: number,
): ElementLayout {
  if (element.kind === 'header') {
    const height =
      viewport === 'mobile'
        ? (element.size.mobile?.height ?? element.size.desktop.height)
        : element.size.desktop.height

    return {
      position: { x: 0, y: 0 },
      size: {
        width: canvasWidth > 0 ? canvasWidth : HEADER_SERIALIZED_WIDTH,
        height,
      },
    }
  }

  if (viewport === 'desktop') {
    const layout = {
      position: { ...element.position.desktop },
      size: { ...element.size.desktop },
    }

    return element.kind === 'image' && element.mode === 'contain'
      ? normalizeContainedImageLayout(element.assetMetadata, layout, canvasWidth)
      : layout
  }

  const inheritedSize = getInheritedMobileSize(element, canvasWidth)
  const size = element.size.mobile
    ? { ...element.size.mobile }
    : inheritedSize
  const inheritedPosition = getInheritedMobilePosition(
    element,
    Math.max(0, canvasWidth - size.width),
  )
  const position = element.position.mobile
    ? { ...element.position.mobile }
    : inheritedPosition

  const layout = { position, size }

  return element.kind === 'image' && element.mode === 'contain'
    ? normalizeContainedImageLayout(element.assetMetadata, layout, canvasWidth)
    : layout
}
