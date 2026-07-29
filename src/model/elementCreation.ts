import type { ButtonAssetId } from './buttonAsset'
import type { ElementKind } from './editorProject'
import type { ImageAssetId, ImageAssetMetadata } from './imageAsset'

export type StandardElementKind = Exclude<ElementKind, 'image' | 'button'>

export type ElementCreationRequest =
  | {
      kind: StandardElementKind
    }
  | {
      kind: 'image'
      assetId: ImageAssetId
      assetMetadata: ImageAssetMetadata
    }
  | {
      kind: 'button'
      assetId: ButtonAssetId
    }
