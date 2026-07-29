import type { ImageAssetMetadata } from './imageAsset'

export const MIN_IMAGE_ZOOM = 1
export const MAX_IMAGE_ZOOM = 3

export type ImageMode = 'contain' | 'crop'

export type ImageTransform = {
  zoom: number
  offsetX: number
  offsetY: number
}

export type ImageFrameSize = {
  width: number
  height: number
}

export type ImageRenderLayout = {
  left: number
  top: number
  width: number
  height: number
}

export const DEFAULT_IMAGE_FRAME_SIZE: ImageFrameSize = {
  width: 240,
  height: 160,
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

function getBaseCropScale(metadata: ImageAssetMetadata) {
  return Math.max(
    DEFAULT_IMAGE_FRAME_SIZE.width / metadata.width,
    DEFAULT_IMAGE_FRAME_SIZE.height / metadata.height,
  )
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

export function getMinimumImageZoomForFrame(
  metadata: ImageAssetMetadata,
  frameSize: ImageFrameSize,
) {
  const baseScale = getBaseCropScale(metadata)
  const baseWidth = metadata.width * baseScale
  const baseHeight = metadata.height * baseScale

  return clamp(
    Math.max(frameSize.width / baseWidth, frameSize.height / baseHeight),
    MIN_IMAGE_ZOOM,
    MAX_IMAGE_ZOOM,
  )
}

export function normalizeImageTransformForFrame(
  value: ImageTransform,
  metadata: ImageAssetMetadata,
  frameSize: ImageFrameSize,
): ImageTransform | null {
  const normalized = normalizeImageTransform(value)

  if (!normalized) {
    return null
  }

  return {
    ...normalized,
    zoom: Math.max(
      normalized.zoom,
      getMinimumImageZoomForFrame(metadata, frameSize),
    ),
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

export function getImageCropSize(
  metadata: ImageAssetMetadata,
  transform: ImageTransform,
): ImageFrameSize {
  const normalizedTransform =
    normalizeImageTransform(transform) ?? DEFAULT_IMAGE_TRANSFORM
  const scale = getBaseCropScale(metadata) * normalizedTransform.zoom

  return {
    width: metadata.width * scale,
    height: metadata.height * scale,
  }
}

export function getImageRenderLayout(
  metadata: ImageAssetMetadata,
  frameSize: ImageFrameSize,
  mode: ImageMode,
  transform: ImageTransform,
): ImageRenderLayout {
  if (mode === 'contain') {
    const scale = Math.min(
      frameSize.width / metadata.width,
      frameSize.height / metadata.height,
    )
    const width = metadata.width * scale
    const height = metadata.height * scale

    return {
      width,
      height,
      left: (frameSize.width - width) / 2,
      top: (frameSize.height - height) / 2,
    }
  }

  const normalizedTransform =
    normalizeImageTransformForFrame(transform, metadata, frameSize) ??
    DEFAULT_IMAGE_TRANSFORM
  const size = getImageCropSize(metadata, normalizedTransform)
  const overflowX = Math.max(0, size.width - frameSize.width)
  const overflowY = Math.max(0, size.height - frameSize.height)

  return {
    ...size,
    left: -overflowX / 2 + (normalizedTransform.offsetX * overflowX) / 2,
    top: -overflowY / 2 + (normalizedTransform.offsetY * overflowY) / 2,
  }
}

export function moveImageTransform(
  metadata: ImageAssetMetadata,
  frameSize: ImageFrameSize,
  initialTransform: ImageTransform,
  deltaX: number,
  deltaY: number,
): ImageTransform {
  const normalizedTransform =
    normalizeImageTransformForFrame(initialTransform, metadata, frameSize) ??
    DEFAULT_IMAGE_TRANSFORM
  const size = getImageCropSize(metadata, normalizedTransform)
  const overflowX = Math.max(0, size.width - frameSize.width)
  const overflowY = Math.max(0, size.height - frameSize.height)

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
