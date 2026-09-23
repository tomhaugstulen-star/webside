import { getMinimumElementSize } from './elementDimensions'
import type { ElementLayout, ResizeHandle } from './elementLayout'
import type { CanvasPosition } from './editorProject'
import type { ImageAssetMetadata } from './imageAsset'

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function getAspectRatio(metadata: ImageAssetMetadata) {
  return metadata.width / metadata.height
}

function getMinimumAspectSize(metadata: ImageAssetMetadata) {
  const ratio = getAspectRatio(metadata)
  const minimum = getMinimumElementSize('image')
  const width = Math.max(minimum.width, minimum.height * ratio)

  return {
    width,
    height: width / ratio,
  }
}

export function normalizeContainedImageLayout(
  metadata: ImageAssetMetadata,
  layout: ElementLayout,
  canvasWidth: number,
): ElementLayout {
  const ratio = getAspectRatio(metadata)
  const scale = Math.min(
    layout.size.width / metadata.width,
    layout.size.height / metadata.height,
  )
  const minimum = getMinimumAspectSize(metadata)
  let width = Math.max(metadata.width * scale, minimum.width)
  let height = width / ratio

  if (canvasWidth > 0 && width > canvasWidth) {
    width = canvasWidth
    height = width / ratio
  }

  const centerX = layout.position.x + layout.size.width / 2
  const centerY = layout.position.y + layout.size.height / 2
  const maximumX = Math.max(0, canvasWidth - width)

  return {
    position: {
      x: canvasWidth > 0 ? clamp(centerX - width / 2, 0, maximumX) : centerX - width / 2,
      y: Math.max(0, centerY - height / 2),
    },
    size: { width, height },
  }
}

function getCornerScale(
  initialLayout: ElementLayout,
  delta: CanvasPosition,
  handle: ResizeHandle,
) {
  const width = initialLayout.size.width
  const height = initialLayout.size.height
  const horizontalDirection = handle.includes('west') ? -1 : 1
  const verticalDirection = handle.includes('north') ? -1 : 1
  const horizontalScale = (width + horizontalDirection * delta.x) / width
  const verticalScale = (height + verticalDirection * delta.y) / height

  return Math.abs(horizontalScale - 1) >= Math.abs(verticalScale - 1)
    ? horizontalScale
    : verticalScale
}

export function resizeContainedImageLayout(
  metadata: ImageAssetMetadata,
  initialLayout: ElementLayout,
  delta: CanvasPosition,
  canvasWidth: number,
  handle: ResizeHandle,
): ElementLayout {
  const ratio = getAspectRatio(metadata)
  const minimum = getMinimumAspectSize(metadata)
  const centerX = initialLayout.position.x + initialLayout.size.width / 2
  const centerY = initialLayout.position.y + initialLayout.size.height / 2
  const right = initialLayout.position.x + initialLayout.size.width
  const bottom = initialLayout.position.y + initialLayout.size.height

  let desiredWidth = initialLayout.size.width

  if (handle === 'east') {
    desiredWidth += delta.x
  } else if (handle === 'west') {
    desiredWidth -= delta.x
  } else if (handle === 'south') {
    desiredWidth = (initialLayout.size.height + delta.y) * ratio
  } else if (handle === 'north') {
    desiredWidth = (initialLayout.size.height - delta.y) * ratio
  } else {
    desiredWidth *= getCornerScale(initialLayout, delta, handle)
  }

  let maximumWidth = Number.POSITIVE_INFINITY

  if (handle.includes('east') && !handle.includes('west')) {
    maximumWidth = canvasWidth - initialLayout.position.x
  } else if (handle.includes('west')) {
    maximumWidth = right
  } else {
    maximumWidth = 2 * Math.min(centerX, canvasWidth - centerX)
  }

  if (handle === 'north') {
    maximumWidth = Math.min(maximumWidth, bottom * ratio)
  } else if (handle.includes('north')) {
    maximumWidth = Math.min(maximumWidth, bottom * ratio)
  }

  const width = clamp(desiredWidth, minimum.width, Math.max(minimum.width, maximumWidth))
  const height = width / ratio

  let x = initialLayout.position.x
  let y = initialLayout.position.y

  if (handle.includes('west')) {
    x = right - width
  } else if (!handle.includes('east')) {
    x = centerX - width / 2
  }

  if (handle.includes('north')) {
    y = bottom - height
  } else if (!handle.includes('south')) {
    y = centerY - height / 2
  }

  return {
    position: {
      x: clamp(x, 0, Math.max(0, canvasWidth - width)),
      y: Math.max(0, y),
    },
    size: { width, height },
  }
}
