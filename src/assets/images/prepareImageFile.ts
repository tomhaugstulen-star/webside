import {
  MAX_IMAGE_FILE_BYTES,
  isSupportedImageMimeType,
  type ImageAssetMetadata,
} from '../../model/imageAsset'

export type PreparedImageFile = {
  file: File
  metadata: ImageAssetMetadata
}

export type PrepareImageFileResult =
  | { ok: true; value: PreparedImageFile }
  | { ok: false; message: string }

async function readDimensionsWithImageElement(file: File) {
  const objectUrl = URL.createObjectURL(file)

  try {
    return await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const image = new Image()
        image.onload = () =>
          resolve({ width: image.naturalWidth, height: image.naturalHeight })
        image.onerror = () => reject(new Error('Image decoding failed.'))
        image.src = objectUrl
      },
    )
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function readImageDimensions(file: File) {
  if (typeof globalThis.createImageBitmap === 'function') {
    const bitmap = await globalThis.createImageBitmap(file)

    try {
      return { width: bitmap.width, height: bitmap.height }
    } finally {
      bitmap.close()
    }
  }

  return readDimensionsWithImageElement(file)
}

export async function prepareImageFile(
  file: File,
): Promise<PrepareImageFileResult> {
  const mimeType = file.type

  if (!isSupportedImageMimeType(mimeType)) {
    return {
      ok: false,
      message: 'Velg en PNG-, JPEG- eller WebP-fil.',
    }
  }

  if (file.size <= 0) {
    return { ok: false, message: 'Bildefilen er tom.' }
  }

  if (file.size > MAX_IMAGE_FILE_BYTES) {
    return {
      ok: false,
      message: 'Bildefilen kan ikke være større enn 10 MB.',
    }
  }

  if (!file.name.trim()) {
    return { ok: false, message: 'Bildefilen mangler filnavn.' }
  }

  try {
    const dimensions = await readImageDimensions(file)

    if (dimensions.width <= 0 || dimensions.height <= 0) {
      return { ok: false, message: 'Bildet har ugyldige dimensjoner.' }
    }

    return {
      ok: true,
      value: {
        file,
        metadata: {
          fileName: file.name,
          mimeType,
          byteSize: file.size,
          width: dimensions.width,
          height: dimensions.height,
        },
      },
    }
  } catch {
    return {
      ok: false,
      message: 'Bildefilen kunne ikke leses. Velg en annen fil.',
    }
  }
}
