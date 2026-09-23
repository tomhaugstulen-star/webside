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

export type ProjectFileReadErrorCode =
  | 'invalid-json'
  | 'invalid-envelope'
  | 'unsupported-format-version'
  | 'invalid-project'
  | 'invalid-asset'
  | 'duplicate-asset'
  | 'missing-asset'
  | 'asset-mismatch'

export type ProjectFileReadResult =
  | { ok: true; value: ImportedProjectFile }
  | { ok: false; error: ProjectFileReadErrorCode }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function parseAsset(
  value: unknown,
): Promise<
  | { ok: true; value: ImportedProjectAsset }
  | { ok: false; error: 'invalid-asset' | 'asset-mismatch' }
> {
  if (
    !isRecord(value) ||
    Object.keys(value).length !== 3 ||
    !isImageAssetId(value.assetId) ||
    !isValidImageAssetMetadata(value.metadata) ||
    typeof value.base64 !== 'string'
  ) {
    return { ok: false, error: 'invalid-asset' }
  }

  if (value.base64.length !== 4 * Math.ceil(value.metadata.byteSize / 3)) {
    return { ok: false, error: 'asset-mismatch' }
  }

  const bytes = base64ToBytes(value.base64)
  if (!bytes || bytes.byteLength !== value.metadata.byteSize) {
    return { ok: false, error: 'asset-mismatch' }
  }

  const file = new File([bytes], value.metadata.fileName, {
    type: value.metadata.mimeType,
  })
  const prepared = await prepareImageFile(file)

  if (
    !prepared.ok ||
    !imageAssetMetadataEqual(prepared.value.metadata, value.metadata)
  ) {
    return { ok: false, error: 'asset-mismatch' }
  }

  return {
    ok: true,
    value: {
      assetId: value.assetId,
      metadata: { ...value.metadata },
      file: prepared.value.file,
    },
  }
}

export async function readProjectFileResult(
  file: File,
): Promise<ProjectFileReadResult> {
  let parsed: unknown

  try {
    parsed = JSON.parse(await file.text())
  } catch {
    return { ok: false, error: 'invalid-json' }
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: 'invalid-envelope' }
  }

  if (
    parsed.format !== PROJECT_FILE_FORMAT ||
    !('formatVersion' in parsed) ||
    !('project' in parsed) ||
    !Array.isArray(parsed.assets)
  ) {
    return { ok: false, error: 'invalid-envelope' }
  }

  if (parsed.formatVersion !== PROJECT_FILE_FORMAT_VERSION) {
    return { ok: false, error: 'unsupported-format-version' }
  }

  if (
    Object.keys(parsed).length !== 4 ||
    !Object.keys(parsed).every((key) =>
      ['format', 'formatVersion', 'project', 'assets'].includes(key),
    )
  ) {
    return { ok: false, error: 'invalid-envelope' }
  }

  const project = parseImportedEditorProject(parsed.project)
  if (!project) {
    return { ok: false, error: 'invalid-project' }
  }

  const assets: ImportedProjectAsset[] = []
  const seenIds = new Set<ImageAssetId>()

  for (const value of parsed.assets) {
    if (!isRecord(value) || !isImageAssetId(value.assetId)) continue
    if (seenIds.has(value.assetId)) {
      return { ok: false, error: 'duplicate-asset' }
    }
    seenIds.add(value.assetId)
  }

  for (const value of parsed.assets) {
    const assetResult = await parseAsset(value)
    if (!assetResult.ok) return assetResult
    assets.push(assetResult.value)
  }

  const references = getProjectAssetReferences(project)
  if (!references) {
    return { ok: false, error: 'asset-mismatch' }
  }

  if (references.length !== assets.length) {
    return { ok: false, error: 'missing-asset' }
  }

  for (const reference of references) {
    const asset = assets.find(
      (candidate) => candidate.assetId === reference.assetId,
    )
    if (!asset) return { ok: false, error: 'missing-asset' }

    if (!imageAssetMetadataEqual(asset.metadata, reference.metadata)) {
      return { ok: false, error: 'asset-mismatch' }
    }
  }

  return { ok: true, value: { project, assets } }
}

export async function readProjectFile(
  file: File,
): Promise<ImportedProjectFile | null> {
  const result = await readProjectFileResult(file)
  return result.ok ? result.value : null
}
