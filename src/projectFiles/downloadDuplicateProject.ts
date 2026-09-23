import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import type { EditorProject } from '../model/editorProject'
import type { ImageAssetId } from '../model/imageAsset'
import { createDuplicateProject } from './createDuplicateProject'
import { createProjectFileBlob } from './createProjectFile'
import { downloadProjectBlob } from './downloadProjectBlob'
import { createProjectFileName } from './projectFileFormat'

type GetImageAsset = (assetId: ImageAssetId) => ImageAssetResource | null

export async function downloadDuplicateProject(
  project: EditorProject,
  getImageAsset: GetImageAsset,
) {
  const duplicate = createDuplicateProject(project)
  const blob = await createProjectFileBlob(duplicate, getImageAsset)

  if (!blob) return false

  downloadProjectBlob(blob, createProjectFileName(duplicate.name))
  return true
}
