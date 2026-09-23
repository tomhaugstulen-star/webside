import type { SupportedImageMimeType } from '../../model/imageAsset'

// Decoding alone can accept a PNG labelled as JPEG. Check the declared format
// before the existing decoder validates dimensions and the full image payload.
export function imageBytesMatchMimeType(bytes: Uint8Array, mimeType: SupportedImageMimeType) {
  const startsWith = (signature: readonly number[], offset = 0) =>
    signature.every((byte, index) => bytes[offset + index] === byte)

  switch (mimeType) {
    case 'image/png':
      return startsWith([137, 80, 78, 71, 13, 10, 26, 10])
    case 'image/jpeg':
      return startsWith([255, 216, 255])
    case 'image/webp':
      return startsWith([82, 73, 70, 70]) && startsWith([87, 69, 66, 80], 8)
  }
}
