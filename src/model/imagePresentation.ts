import type { ElementSize } from './editorProject'
import type { ImageAssetMetadata } from './imageAsset'

export const MIN_IMAGE_ZOOM = 1
export const MAX_IMAGE_ZOOM = 3

export type ImageMode = 'contain' | 'crop'

export type ImageTransform = {
  zoom: number
  offsetX: number
  offsetY: number
}

export type ImageRenderLayout = {
  left: number
  top: number
  width: number
  height: number
}

export const DEFAULT_IMAGE_MODE: ImageMode = 'contain'
export const DEFAULT_IMAGE_TRANSFORM: ImageTransform = {
  zoom: MIN_IMAGE_ZOOM,
  offsetX: 0,
  offsetY: 0,
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function isImageMode(value: unknown): value is ImageMode {
  return value === 'contain' || value === 'crop'
}

export function normalizeImageTransform(
  value: ImageTransform,
): ImageTransform | null {
  if (![value.zoom, value.offsetX, value.offsetY].every(Number.isFinite)) {
    return null
  }

  return {
    zoom: clamp(value.zoom, MIN_IMAGE_ZOOM, MAX_IMAGE_ZOOM),
    offsetX: clamp(value.offsetX, -1, 1),
    offsetY: clamp(value.offsetY, -1, 1),
  }
}

export function imageTransformsEqual(
  first: ImageTransform,
  second: ImageTransform,
) {
  return (
    first.zoom === second.zoom &&
    first.offsetX === second.offsetX &&
    first.offsetY === second.offsetY
  )
}

export function getImageRenderLayout(
  metadata: ImageAssetMetadata,
  frameSize: ElementSize,
  mode: ImageMode,
  transform: ImageTransform,
): ImageRenderLayout {
  const widthScale = frameSize.width / metadata.width
  const heightScale = frameSize.height / metadata.height
  const normalizedTransform =
    normalizeImageTransform(transform) ?? DEFAULT_IMAGE_TRANSFORM
  const scale =
    mode === 'contain'
      ? Math.min(widthScale, heightScale)
      : Math.max(widthScale, heightScale) * normalizedTransform.zoom
  const width = metadata.width * scale
  const height = metadata.height * scale
  const overflowX = Math.max(0, width - frameSize.width)
  const overflowY = Math.max(0, height - frameSize.height)

  return {
    width,
    height,
    left:
      mode === 'contain'
        ? (frameSize.width - width) / 2
        : -overflowX / 2 + (normalizedTransform.offsetX * overflowX) / 2,
    top:
      mode === 'contain'
        ? (frameSize.height - height) / 2
        : -overflowY / 2 + (normalizedTransform.offsetY * overflowY) / 2,
  }
}

export function moveImageTransform(
  metadata: ImageAssetMetadata,
  frameSize: ElementSize,
  initialTransform: ImageTransform,
  deltaX: number,
  deltaY: number,
): ImageTransform {
  const normalizedTransform =
    normalizeImageTransform(initialTransform) ?? DEFAULT_IMAGE_TRANSFORM
  const layout = getImageRenderLayout(
    metadata,
    frameSize,
    'crop',
    normalizedTransform,
  )
  const overflowX = Math.max(0, layout.width - frameSize.width)
  const overflowY = Math.max(0, layout.height - frameSize.height)

  return {
    ...normalizedTransform,
    offsetX:
      overflowX > 0
        ? clamp(normalizedTransform.offsetX + (2 * deltaX) / overflowX, -1, 1)
        : 0,
    offsetY:
      overflowY > 0
        ? clamp(normalizedTransform.offsetY + (2 * deltaY) / overflowY, -1, 1)
        : 0,
  }
}
