import { createStableId } from './createStableId'

export const MAX_IMAGE_FILE_BYTES = 10 * 1024 * 1024
export const MAX_IMAGE_DIMENSION_PX = 16_384
export const MAX_IMAGE_PIXEL_COUNT = 40_000_000

export const supportedImageMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const

export type SupportedImageMimeType = (typeof supportedImageMimeTypes)[number]
export type ImageAssetId = string & { readonly __imageAssetId: unique symbol }

export type ImageAssetMetadata = {
  fileName: string
  mimeType: SupportedImageMimeType
  byteSize: number
  width: number
  height: number
}

const stableIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function createImageAssetId(): ImageAssetId {
  return createStableId() as ImageAssetId
}

export function isImageAssetId(value: unknown): value is ImageAssetId {
  return typeof value === 'string' && stableIdPattern.test(value)
}

export function isSupportedImageMimeType(
  value: unknown,
): value is SupportedImageMimeType {
  return supportedImageMimeTypes.some((mimeType) => mimeType === value)
}

export function hasValidImagePixelDimensions(
  width: unknown,
  height: unknown,
) {
  if (typeof width !== 'number' || typeof height !== 'number') {
    return false
  }

  return (
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width > 0 &&
    height > 0 &&
    width <= MAX_IMAGE_DIMENSION_PX &&
    height <= MAX_IMAGE_DIMENSION_PX &&
    width * height <= MAX_IMAGE_PIXEL_COUNT
  )
}

export function isValidImageAssetMetadata(
  value: unknown,
): value is ImageAssetMetadata {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const metadata = value as Partial<ImageAssetMetadata>

  return (
    typeof metadata.fileName === 'string' &&
    metadata.fileName.trim().length > 0 &&
    isSupportedImageMimeType(metadata.mimeType) &&
    Number.isInteger(metadata.byteSize) &&
    (metadata.byteSize ?? 0) > 0 &&
    (metadata.byteSize ?? 0) <= MAX_IMAGE_FILE_BYTES &&
    hasValidImagePixelDimensions(metadata.width, metadata.height)
  )
}

export function normalizeImageAltText(value: string) {
  return value.trim()
}
