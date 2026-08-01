import type { EditorProject } from '../model/editorProject'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'
import {
  getReferencedImageAssetMetadata,
  imageAssetMetadataEqual,
  isValidEditorProject,
} from './editorProjectValidation'
import {
  LOCAL_PROJECT_STORAGE_VERSION,
  type LocalProjectEnvelope,
  type LocalProjectSnapshot,
  type StoredImageAsset,
} from './localProjectTypes'
import {
  hasExactKeys,
  isIsoTimestamp,
  isRecord,
} from './validationHelpers'

export function isValidLocalProjectEnvelope(
  value: unknown,
): value is LocalProjectEnvelope {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['storageVersion', 'project', 'savedAt']) &&
    value.storageVersion === LOCAL_PROJECT_STORAGE_VERSION &&
    isValidEditorProject(value.project) &&
    isIsoTimestamp(value.savedAt)
  )
}

export function isValidStoredImageAsset(
  value: unknown,
): value is StoredImageAsset {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ['assetId', 'file', 'metadata']) ||
    !isImageAssetId(value.assetId) ||
    typeof File === 'undefined' ||
    !(value.file instanceof File) ||
    !isValidImageAssetMetadata(value.metadata)
  ) {
    return false
  }

  return (
    value.file.name === value.metadata.fileName &&
    value.file.type === value.metadata.mimeType &&
    value.file.size === value.metadata.byteSize
  )
}

export function createLocalProjectEnvelope(
  project: EditorProject,
  savedAt = new Date().toISOString(),
): LocalProjectEnvelope | null {
  const envelope = {
    storageVersion: LOCAL_PROJECT_STORAGE_VERSION,
    project,
    savedAt,
  }

  return isValidLocalProjectEnvelope(envelope) ? envelope : null
}

export function validateLocalProjectSnapshot(
  envelope: unknown,
  assets: unknown,
): LocalProjectSnapshot | null {
  if (!isValidLocalProjectEnvelope(envelope) || !Array.isArray(assets)) {
    return null
  }

  const validAssets = assets.filter(isValidStoredImageAsset)
  const assetMap = new Map(validAssets.map((asset) => [asset.assetId, asset]))
  const requiredMetadata = getReferencedImageAssetMetadata(envelope.project)

  if (!requiredMetadata) {
    return null
  }

  const referencedAssets: StoredImageAsset[] = []

  for (const [assetId, metadata] of requiredMetadata) {
    const asset = assetMap.get(assetId)

    if (!asset || !imageAssetMetadataEqual(asset.metadata, metadata)) {
      return null
    }

    referencedAssets.push(asset)
  }

  return {
    envelope,
    assets: referencedAssets,
  }
}
