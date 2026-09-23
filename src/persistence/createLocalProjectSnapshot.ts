import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import type { EditorProject } from '../model/editorProject'
import { isValidEditorProject } from '../model/editorProjectValidation'
import type { ImageAssetId } from '../model/imageAsset'
import {
  getProjectAssetReferences,
  imageAssetMetadataEqual,
} from '../projectFiles/projectAssetReferences'
import {
  LOCAL_PROJECT_STORAGE_VERSION,
  type LocalProjectSnapshot,
} from './localProjectStorage'

type GetImageAsset = (assetId: ImageAssetId) => ImageAssetResource | null

export function createLocalProjectSnapshot(
  project: EditorProject,
  getImageAsset: GetImageAsset,
): LocalProjectSnapshot | null {
  if (!isValidEditorProject(project)) return null

  const references = getProjectAssetReferences(project)
  if (!references) return null

  const assets = []
  for (const reference of references) {
    const resource = getImageAsset(reference.assetId)

    if (
      !resource ||
      !imageAssetMetadataEqual(reference.metadata, resource.metadata) ||
      resource.file.name !== reference.metadata.fileName ||
      resource.file.type !== reference.metadata.mimeType ||
      resource.file.size !== reference.metadata.byteSize
    ) {
      return null
    }

    assets.push({
      assetId: reference.assetId,
      metadata: { ...reference.metadata },
      file: resource.file,
    })
  }

  return {
    storageVersion: LOCAL_PROJECT_STORAGE_VERSION,
    project,
    assets,
  }
}
