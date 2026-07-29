import type { ButtonAssetId } from './buttonAsset'
import type { ElementKind } from './editorProject'

export type StandardElementKind = Exclude<ElementKind, 'button'>

export type ElementCreationRequest =
  | {
      kind: StandardElementKind
    }
  | {
      kind: 'button'
      assetId: ButtonAssetId
    }
