import { prepareImageFile } from '../assets/images/prepareImageFile'
import { createBlankProject } from '../model/createEditorProject'
import { createImageAssetId } from '../model/imageAsset'
import type { ImportedProjectFile } from '../projectFiles/projectFileFormat'
import { importNavigation } from './genericSiteNavigation'
import { createPageFromHtml, type AssetMapEntry } from './genericSitePage'
import { readZipEntries } from './readZipEntries'

type GenericReadResult =
  | { ok: true; value: ImportedProjectFile; warnings: string[] }
  | { ok: false; message: string }

function mimeForPath(path: string) {
  const lower = path.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  return null
}

export async function readGenericSiteZip(file: File): Promise<GenericReadResult> {
  try {
    const entries = await readZipEntries(file)
    const htmlEntries = entries.filter((entry) => entry.path.toLowerCase().endsWith('.html'))
    if (!htmlEntries.length) {
      return { ok: false, message: 'ZIP-filen inneholder ingen HTML-sider.' }
    }

    const assetsByPath = new Map<string, AssetMapEntry>()
    const assets: ImportedProjectFile['assets'] = []
    for (const entry of entries) {
      const mime = mimeForPath(entry.path)
      if (!mime) continue
      const name = entry.path.split('/').at(-1) || 'bilde'
      const prepared = await prepareImageFile(new File([entry.bytes], name, { type: mime }))
      if (!prepared.ok) continue
      const assetId = createImageAssetId()
      const asset = { assetId, metadata: prepared.value.metadata, file: prepared.value.file }
      assetsByPath.set(entry.path, asset)
      assets.push(asset)
    }

    const project = createBlankProject(
      file.name.replace(/\.zip$/i, '').replace(/[-_]+/g, ' ').trim() || 'Importert nettsted',
    )
    project.pages = []
    const decoder = new TextDecoder()
    const filesByPath = new Map(entries.map((entry) => [entry.path, entry.bytes]))
    for (const entry of htmlEntries) {
      const page = createPageFromHtml(
        entry.path, decoder.decode(entry.bytes), assetsByPath, filesByPath,
      )
      if (page) project.pages.push(page)
    }
    if (!project.pages.length) {
      return { ok: false, message: 'Ingen støttede HTML-sider kunne importeres.' }
    }

    const htmlPages = htmlEntries.map((entry) => ({
      path: entry.path,
      document: new DOMParser().parseFromString(decoder.decode(entry.bytes), 'text/html'),
    }))
    importNavigation(project, htmlPages)

    return {
      ok: true,
      value: { project, assets },
      warnings: [
        'Enkel CSS er tolket. Avansert layout, script og komplekse selektorer kan kreve manuell justering.',
      ],
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Nettstedet kunne ikke importeres.',
    }
  }
}
