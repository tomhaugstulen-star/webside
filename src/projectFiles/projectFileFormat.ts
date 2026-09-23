import type { EditorProject } from '../model/editorProject'
import type {
  ImageAssetId,
  ImageAssetMetadata,
} from '../model/imageAsset'

export const PROJECT_FILE_FORMAT = 'website-editor-project' as const
export const PROJECT_FILE_FORMAT_VERSION = 1 as const
export const PROJECT_FILE_EXTENSION = '.website-project'

export type ProjectFileAsset = {
  assetId: ImageAssetId
  metadata: ImageAssetMetadata
  base64: string
}

export type ProjectFileV1 = {
  format: typeof PROJECT_FILE_FORMAT
  formatVersion: typeof PROJECT_FILE_FORMAT_VERSION
  project: EditorProject
  assets: ProjectFileAsset[]
}

export type ImportedProjectAsset = {
  assetId: ImageAssetId
  metadata: ImageAssetMetadata
  file: File
}

export type ImportedProjectFile = {
  project: EditorProject
  assets: ImportedProjectAsset[]
}

function createSafeProjectBaseName(projectName: string) {
  return (
    projectName
      .trim()
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/å/g, 'a')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'prosjekt'
  )
}

export function createProjectFileName(projectName: string) {
  return `${createSafeProjectBaseName(projectName)}${PROJECT_FILE_EXTENSION}`
}

export function createProjectBackupFileName(
  projectName: string,
  date = new Date(),
) {
  const timestamp = date
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[:T]/g, '-')
    .replace('Z', '')

  return `${createSafeProjectBaseName(projectName)}-backup-${timestamp}${PROJECT_FILE_EXTENSION}`
}
