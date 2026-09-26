type ZipEntryData = {
  path: string
  bytes: Uint8Array<ArrayBuffer>
}

const u16 = (view: DataView, at: number) => view.getUint16(at, true)
const u32 = (view: DataView, at: number) => view.getUint32(at, true)

async function inflateRaw(bytes: Uint8Array<ArrayBuffer>) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Denne nettleseren støtter ikke komprimert ZIP.')
  }

  const stream = new Blob([bytes]).stream().pipeThrough(
    new DecompressionStream('deflate-raw'),
  )
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

function findEndOfCentralDirectory(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const minimum = Math.max(0, bytes.length - 65_557)

  for (let at = bytes.length - 22; at >= minimum; at -= 1) {
    if (u32(view, at) === 0x06054b50) return at
  }

  return -1
}

export async function readZipEntries(file: File): Promise<ZipEntryData[]> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const end = findEndOfCentralDirectory(bytes)
  if (end < 0) throw new Error('ZIP-filen er ugyldig.')

  const count = u16(view, end + 10)
  const centralOffset = u32(view, end + 16)
  const decoder = new TextDecoder()
  const entries: ZipEntryData[] = []
  let cursor = centralOffset

  for (let index = 0; index < count; index += 1) {
    if (u32(view, cursor) !== 0x02014b50) {
      throw new Error('ZIP-filen har en ugyldig katalog.')
    }

    const method = u16(view, cursor + 10)
    const compressedSize = u32(view, cursor + 20)
    const uncompressedSize = u32(view, cursor + 24)
    const nameLength = u16(view, cursor + 28)
    const extraLength = u16(view, cursor + 30)
    const commentLength = u16(view, cursor + 32)
    const localOffset = u32(view, cursor + 42)
    const path = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLength))

    if (path.includes('..') || path.startsWith('/') || path.includes('\\')) {
      throw new Error('ZIP-filen inneholder en ugyldig filsti.')
    }

    if (!path.endsWith('/')) {
      if (u32(view, localOffset) !== 0x04034b50) {
        throw new Error('ZIP-filen har en ugyldig filoppføring.')
      }

      const localNameLength = u16(view, localOffset + 26)
      const localExtraLength = u16(view, localOffset + 28)
      const dataOffset = localOffset + 30 + localNameLength + localExtraLength
      const compressed = bytes.slice(dataOffset, dataOffset + compressedSize)
      const data = method === 0
        ? compressed
        : method === 8
          ? await inflateRaw(compressed)
          : null

      if (!data || data.length !== uncompressedSize) {
        throw new Error('ZIP-filen bruker en komprimering som ikke støttes.')
      }

      entries.push({ path, bytes: data })
    }

    cursor += 46 + nameLength + extraLength + commentLength
  }

  return entries
}
