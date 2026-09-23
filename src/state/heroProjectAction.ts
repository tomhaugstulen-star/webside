import type { EditorColor } from '../model/editorColor'
import type { EditorFill } from '../model/editorFill'
import type { ElementFrameWidth } from '../model/elementFrame'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'

export type HeroProjectAction =
  | {
      type: 'set-hero-content'
      elementId: string
      title: string
      subtitle: string
      ctaLabel: string
      updatedAt: string
    }
  | {
      type: 'set-hero-image'
      elementId: string
      imageAssetId: ImageAssetId
      imageAssetMetadata: ImageAssetMetadata
      updatedAt: string
    }
  | {
      type: 'set-hero-background-fill'
      elementId: string
      fill: EditorFill
      updatedAt: string
    }
  | {
      type: 'set-hero-text-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }
  | {
      type: 'set-hero-frame-width'
      elementId: string
      width: ElementFrameWidth
      updatedAt: string
    }
  | {
      type: 'set-hero-frame-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }
