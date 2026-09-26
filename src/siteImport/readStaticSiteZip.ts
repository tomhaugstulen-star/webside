import { prepareImageFile } from '../assets/images/prepareImageFile'
import { parseImportedEditorProject } from '../model/editorProjectValidation'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
  type SupportedImageMimeType,
} from '../model/imageAsset'
import type { ImportedProjectFile } from '../projectFiles/projectFileFormat'
import {
  getProjectAssetReferences,
  imageAssetMetadataEqual,
} from '../projectFiles/projectAssetReferences'
import {
  STATIC_SITE_MANIFEST_FORMAT,
  STATIC_SITE_MANIFEST_PATH,
  STATIC_SITE_MANIFEST_VERSION,
  type StaticSiteManifestAsset,
} from './staticSiteManifest'
import { readZipEntries } from './readZipEntries'

type ReadResult =
  | { ok: true; value: ImportedProjectFile }
  | { ok: false; message: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validManifestAsset(value: unknown): value is StaticSiteManifestAsset {
  if (!isRecord(value)) return false
  return (
    Object.keys(value).length === 3 &&
    isImageAssetId(value.assetId) &&
    typeof value.path === 'string' &&
    value.path.length > 0 &&
    !value.path.includes('..') &&
    !value.path.startsWith('/') &&
    !value.path.includes('\\') &&
    isValidImageAssetMetadata(value.metadata)
  )
}

function mimeFor(metadata: StaticSiteManifestAsset['metadata']) {
  return metadata.mimeType as SupportedImageMimeType
}

export async function readStaticSiteZip(file: File): Promise<ReadResult> {
  try {
    const entries = await readZipEntries(file)
    const byPath = new Map(entries.map((entry) => [entry.path, entry.bytes]))
    const manifestBytes = byPath.get(STATIC_SITE_MANIFEST_PATH)
    if (!manifestBytes) {
      return {
        ok: false,
        message: 'Nettstedet mangler editorinformasjon og kan ikke åpnes som redigerbart prosjekt.',
      }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(new TextDecoder().decode(manifestBytes))
    } catch {
      return { ok: false, message: 'Editorinformasjonen i nettstedet er ugyldig.' }
    }

    if (
      !isRecord(parsed) ||
      parsed.format !== STATIC_SITE_MANIFEST_FORMAT ||
      parsed.formatVersion !== STATIC_SITE_MANIFEST_VERSION ||
      !Array.isArray(parsed.assets)
    ) {
      return { ok: false, message: 'Nettstedets editorformat støttes ikke.' }
    }

    const project = parseImportedEditorProject(parsed.project)
    if (!project) {
      return { ok: false, message: 'Prosjektdataene i nettstedet er ugyldige.' }
    }

    if (!parsed.assets.every(validManifestAsset)) {
      return { ok: false, message: 'Bildelisten i nettstedet er ugyldig.' }
    }

    const references = getProjectAssetReferences(project)
    if (!references || references.length !== parsed.assets.length) {
      return { ok: false, message: 'Nettstedets bildeliste stemmer ikke med prosjektet.' }
    }

    const ids = new Set<string>()
    const paths = new Set<string>()
    const assets: ImportedProjectFile['assets'] = []

    for (const asset of parsed.assets) {
      if (ids.has(asset.assetId) || paths.has(asset.path)) {
        return { ok: false, message: 'Nettstedet inneholder dupliserte bilder.' }
      }
      ids.add(asset.assetId)
      paths.add(asset.path)

      const reference = references.find((item) => item.assetId === asset.assetId)
      if (!reference || !imageAssetMetadataEqual(reference.metadata, asset.metadata)) {
        return { ok: false, message: 'Nettstedets bildedata stemmer ikke med prosjektet.' }
      }

      const bytes = byPath.get(asset.path)
      if (!bytes) {
        return { ok: false, message: `Bildet «${asset.metadata.fileName}» mangler.` }
      }

      const image = new File([bytes], asset.metadata.fileName, {
        type: mimeFor(asset.metadata),
      })
      const prepared = await prepareImageFile(image)
      if (!prepared.ok ||
        !imageAssetMetadataEqual(prepared.value.metadata, asset.metadata)) {
        return { ok: false, message: `Bildet «${asset.metadata.fileName}» er endret eller ugyldig.` }
      }

      assets.push({
        assetId: asset.assetId,
        metadata: prepared.value.metadata,
        file: prepared.value.file,
      })
    }

    return { ok: true, value: { project, assets } }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Nettstedet kunne ikke åpnes.',
    }
  }
}
