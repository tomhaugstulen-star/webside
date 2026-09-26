import type { EditorProject } from '../model/editorProject'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'

export const STATIC_SITE_MANIFEST_PATH = 'website-editor.json'
export const STATIC_SITE_MANIFEST_FORMAT = 'website-editor-static-site'
export const STATIC_SITE_MANIFEST_VERSION = 1

export type StaticSiteManifestAsset = {
  assetId: ImageAssetId
  path: string
  metadata: ImageAssetMetadata
}

export type StaticSiteManifest = {
  format: typeof STATIC_SITE_MANIFEST_FORMAT
  formatVersion: typeof STATIC_SITE_MANIFEST_VERSION
  project: EditorProject
  assets: StaticSiteManifestAsset[]
}
