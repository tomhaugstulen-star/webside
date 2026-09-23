import { prepareImageFile } from '../assets/images/prepareImageFile'
import { parseImportedEditorProject } from '../model/editorProjectValidation'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
  type ImageAssetId,
} from '../model/imageAsset'
import { base64ToBytes } from './projectFileBase64'
import {
  PROJECT_FILE_FORMAT,
  PROJECT_FILE_FORMAT_VERSION,
  type ImportedProjectAsset,
  type ImportedProjectFile,
} from './projectFileFormat'
import {
  getProjectAssetReferences,
  imageAssetMetadataEqual,
} from './projectAssetReferences'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function parseAsset(value: unknown): Promise<ImportedProjectAsset | null> {
  if (
    !isRecord(value) ||
    Object.keys(value).length !== 3 ||
    !isImageAssetId(value.assetId) ||
    !isValidImageAssetMetadata(value.metadata) ||
    typeof value.base64 !== 'string'
  ) {
    return null
  }

  if (value.base64.length !== 4 * Math.ceil(value.metadata.byteSize / 3)) return null
  const bytes = base64ToBytes(value.base64)
  if (!bytes || bytes.byteLength !== value.metadata.byteSize) return null

  const file = new File([bytes], value.metadata.fileName, {
    type: value.metadata.mimeType,
  })
  const prepared = await prepareImageFile(file)

  if (
    !prepared.ok ||
    !imageAssetMetadataEqual(prepared.value.metadata, value.metadata)
  ) {
    return null
  }

  return {
    assetId: value.assetId,
    metadata: { ...value.metadata },
    file: prepared.value.file,
  }
}

export async function readProjectFile(
  file: File,
): Promise<ImportedProjectFile | null> {
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    return null
  }

  if (
    !isRecord(parsed) ||
    Object.keys(parsed).length !== 4 ||
    parsed.format !== PROJECT_FILE_FORMAT ||
    parsed.formatVersion !== PROJECT_FILE_FORMAT_VERSION ||
    !Array.isArray(parsed.assets)
  ) {
    return null
  }

  const project = parseImportedEditorProject(parsed.project)
  if (!project) return null

  const assets: ImportedProjectAsset[] = []
  const seenIds = new Set<ImageAssetId>()

  for (const value of parsed.assets) {
    const asset = await parseAsset(value)
    if (!asset || seenIds.has(asset.assetId)) return null
    seenIds.add(asset.assetId)
    assets.push(asset)
  }

  const references = getProjectAssetReferences(project)
  if (!references || references.length !== assets.length) return null

  for (const reference of references) {
    const asset = assets.find((candidate) => candidate.assetId === reference.assetId)
    if (!asset || !imageAssetMetadataEqual(asset.metadata, reference.metadata)) {
      return null
    }
  }

  return { project, assets }
}
