import type { EditorProject } from '../model/editorProject'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'

export const LOCAL_PROJECT_STORAGE_VERSION = 1 as const

export type StoredImageAsset = {
  assetId: ImageAssetId
  file: File
  metadata: ImageAssetMetadata
}

export type LocalProjectEnvelope = {
  storageVersion: typeof LOCAL_PROJECT_STORAGE_VERSION
  project: EditorProject
  savedAt: string
}

export type LocalProjectSnapshot = {
  envelope: LocalProjectEnvelope
  assets: StoredImageAsset[]
}

export type LocalProjectLoadResult =
  | { status: 'empty' }
  | { status: 'ready'; snapshot: LocalProjectSnapshot }
  | {
      status: 'error'
      reason: 'invalid-data' | 'storage-unavailable'
      message: string
    }
