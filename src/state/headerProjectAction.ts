import type { HeaderAppearance } from '../model/headerAppearance'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'

export type HeaderProjectAction =
  | {
      type: 'set-header-content'
      elementId: string
      siteName: string
      subtitle: string
      updatedAt: string
    }
  | {
      type: 'set-header-logo'
      elementId: string
      logoAssetId: ImageAssetId
      logoAssetMetadata: ImageAssetMetadata
      updatedAt: string
    }
  | {
      type: 'apply-header-ai-proposal'
      elementId: string
      siteName: string
      subtitle: string
      appearance: HeaderAppearance
      updatedAt: string
    }
