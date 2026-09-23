import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import { isValidEditorProject } from '../model/editorProjectValidation'
import type { EditorProject } from '../model/editorProject'
import type { ImageAssetId } from '../model/imageAsset'
import { arrayBufferToBase64 } from './projectFileBase64'
import {
  PROJECT_FILE_FORMAT,
  PROJECT_FILE_FORMAT_VERSION,
  type ProjectFileAsset,
  type ProjectFileV1,
} from './projectFileFormat'
import {
  getProjectAssetReferences,
  imageAssetMetadataEqual,
} from './projectAssetReferences'

type GetImageAsset = (assetId: ImageAssetId) => ImageAssetResource | null

export async function createProjectFileBlob(
  project: EditorProject,
  getImageAsset: GetImageAsset,
): Promise<Blob | null> {
  if (!isValidEditorProject(project)) return null
  const references = getProjectAssetReferences(project)
  if (!references) return null

  const assets: ProjectFileAsset[] = []
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
      base64: arrayBufferToBase64(await resource.file.arrayBuffer()),
    })
  }

  const envelope: ProjectFileV1 = {
    format: PROJECT_FILE_FORMAT,
    formatVersion: PROJECT_FILE_FORMAT_VERSION,
    project,
    assets,
  }

  return new Blob([JSON.stringify(envelope)], {
    type: 'application/json;charset=utf-8',
  })
}
