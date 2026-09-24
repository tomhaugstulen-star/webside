// ZIP store method: interoperable without a compression library or network dependency.
export type ZipEntry = { path: string; bytes: Uint8Array<ArrayBuffer> }
const encoder = new TextEncoder()
const u16 = (view: DataView, at: number, n: number) => view.setUint16(at, n, true)
const u32 = (view: DataView, at: number, n: number) => view.setUint32(at, n, true)

function crc32(bytes: Uint8Array) {
  let crc = -1
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ -1) >>> 0
}

export function createZip(entries: ZipEntry[]): Blob {
  if (entries.length > 65535) throw new Error('For mange filer i eksporten.')
  const locals: Uint8Array<ArrayBuffer>[] = []
  const centrals: Uint8Array<ArrayBuffer>[] = []
  let offset = 0
  const paths = new Set<string>()
  for (const entry of entries) {
    if (paths.has(entry.path) || entry.path.startsWith('/') || entry.path.includes('..') ||
      entry.path.includes('\\')) throw new Error('Ugyldig filsti i eksporten.')
    paths.add(entry.path)
    const name = encoder.encode(entry.path)
    if (name.length > 65535 || entry.bytes.length > 0xffffffff ||
      offset + 30 + name.length + entry.bytes.length > 0xffffffff) {
      throw new Error('Eksporten er for stor for ZIP-formatet.')
    }
    const crc = crc32(entry.bytes)
    const local = new Uint8Array(30 + name.length + entry.bytes.length)
    const l = new DataView(local.buffer)
    u32(l, 0, 0x04034b50); u16(l, 4, 20); u16(l, 6, 0x0800)
    u32(l, 14, crc); u32(l, 18, entry.bytes.length); u32(l, 22, entry.bytes.length)
    u16(l, 26, name.length); local.set(name, 30); local.set(entry.bytes, 30 + name.length)
    locals.push(local)
    const central = new Uint8Array(46 + name.length)
    const c = new DataView(central.buffer)
    u32(c, 0, 0x02014b50); u16(c, 4, 20); u16(c, 6, 20); u16(c, 8, 0x0800)
    u32(c, 16, crc); u32(c, 20, entry.bytes.length); u32(c, 24, entry.bytes.length)
    u16(c, 28, name.length); u32(c, 42, offset); central.set(name, 46)
    centrals.push(central); offset += local.length
  }
  const end = new Uint8Array(22)
  const centralSize = centrals.reduce((n, part) => n + part.length, 0)
  if (offset + centralSize > 0xffffffff) throw new Error('Eksporten er for stor for ZIP-formatet.')
  const e = new DataView(end.buffer)
  u32(e, 0, 0x06054b50); u16(e, 8, entries.length); u16(e, 10, entries.length)
  u32(e, 12, centralSize); u32(e, 16, offset)
  return new Blob([...locals, ...centrals, end], { type: 'application/zip' })
}
