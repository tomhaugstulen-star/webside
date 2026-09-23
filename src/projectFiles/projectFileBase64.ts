const BASE64_CHUNK_SIZE = 0x8000

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, offset + BASE64_CHUNK_SIZE),
    )
  }

  return btoa(binary)
}

export function base64ToBytes(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const binary = atob(value)
    if (btoa(binary) !== value) return null
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }

    return bytes
  } catch {
    return null
  }
}
