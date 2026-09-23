import type { EditorProject } from '../model/editorProject'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'

export const LOCAL_PROJECT_STORAGE_VERSION = 1 as const

export type PersistedImageAsset = {
  assetId: ImageAssetId
  metadata: ImageAssetMetadata
  file: File
}

export type LocalProjectSnapshot = {
  storageVersion: typeof LOCAL_PROJECT_STORAGE_VERSION
  project: EditorProject
  assets: PersistedImageAsset[]
}

export type LocalProjectStorage = {
  load: () => Promise<LocalProjectSnapshot | null>
  save: (snapshot: LocalProjectSnapshot) => Promise<void>
  clear: () => Promise<void>
}
