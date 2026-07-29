import { createStableId } from './createStableId'

export const MAX_IMAGE_FILE_BYTES = 10 * 1024 * 1024

export const supportedImageMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const

export type SupportedImageMimeType = (typeof supportedImageMimeTypes)[number]
export type ImageFit = 'contain' | 'cover'
export type ImageAssetId = string & { readonly __imageAssetId: unique symbol }

export type ImageAssetMetadata = {
  fileName: string
  mimeType: SupportedImageMimeType
  byteSize: number
  width: number
  height: number
}

export const DEFAULT_IMAGE_FIT: ImageFit = 'contain'

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

export function isImageFit(value: unknown): value is ImageFit {
  return value === 'contain' || value === 'cover'
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
    Number.isInteger(metadata.width) &&
    (metadata.width ?? 0) > 0 &&
    Number.isInteger(metadata.height) &&
    (metadata.height ?? 0) > 0
  )
}

export function normalizeImageAltText(value: string) {
  return value.trim()
}
