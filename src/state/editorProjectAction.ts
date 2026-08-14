import type { ButtonAssetId } from '../model/buttonAsset'
import type { ElementCreationRequest } from '../model/elementCreation'
import type { EditorColor } from '../model/editorColor'
import type { ElementFrameWidth } from '../model/elementFrame'
import type { ElementLayout } from '../model/elementLayout'
import type { EditorProject } from '../model/editorProject'
import type { ElementLink } from '../model/elementLink'
import type { ImageMode, ImageTransform } from '../model/imagePresentation'
import type { SectionFrameWidth } from '../model/sectionAppearance'
import type {
  TextElementStylePatch,
  TextFontFamily,
  TextFontSize,
} from '../model/textElementStyle'
import type { NavigationProjectAction } from './navigationProjectAction'
import type { PageProjectAction } from './pageProjectAction'

export type ColorProjectAction =
  | {
      type: 'set-active-page-background-color'
      color: EditorColor
      updatedAt: string
    }
  | {
      type: 'set-section-background-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }
  | {
      type: 'set-section-frame-width'
      elementId: string
      width: SectionFrameWidth
      updatedAt: string
    }
  | {
      type: 'set-section-frame-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }
  | {
      type: 'set-text-background-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }
  | {
      type: 'set-text-frame-width'
      elementId: string
      width: ElementFrameWidth
      updatedAt: string
    }
  | {
      type: 'set-text-frame-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }

export type HeaderAppearanceAction =
  | {
      type: 'set-header-background-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }
  | {
      type: 'set-header-text-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }
  | {
      type: 'set-header-font-family'
      elementId: string
      fontFamily: TextFontFamily
      updatedAt: string
    }
  | {
      type: 'set-header-font-size'
      elementId: string
      fontSize: TextFontSize
      updatedAt: string
    }
  | {
      type: 'set-header-frame-width'
      elementId: string
      width: ElementFrameWidth
      updatedAt: string
    }
  | {
      type: 'set-header-frame-color'
      elementId: string
      color: EditorColor
      updatedAt: string
    }

export type EditorProjectAction =
  | { type: 'replace-project'; project: EditorProject }
  | { type: 'set-active-page'; pageId: string }
  | { type: 'set-selected-element'; elementId: string | null }
  | {
      type: 'add-element-to-active-page'
      elementId: string
      request: ElementCreationRequest
      updatedAt: string
    }
  | {
      type: 'delete-element-from-active-page'
      elementId: string
      updatedAt: string
    }
  | {
      type: 'set-section-anchor-id'
      elementId: string
      anchorId: string
      updatedAt: string
    }
  | {
      type: 'set-element-desktop-layout'
      elementId: string
      layout: ElementLayout
      updatedAt: string
    }
  | {
      type: 'toggle-element-lock'
      elementId: string
      updatedAt: string
    }
  | {
      type: 'set-text-element-content'
      elementId: string
      content: string
      updatedAt: string
    }
  | {
      type: 'set-text-element-style'
      elementId: string
      patch: TextElementStylePatch
      updatedAt: string
    }
  | {
      type: 'set-element-link'
      elementId: string
      link: ElementLink
      updatedAt: string
    }
  | {
      type: 'set-button-label'
      elementId: string
      label: string
      updatedAt: string
    }
  | {
      type: 'set-button-asset'
      elementId: string
      assetId: ButtonAssetId
      updatedAt: string
    }
  | {
      type: 'set-image-alt-text'
      elementId: string
      altText: string
      updatedAt: string
    }
  | {
      type: 'set-image-mode'
      elementId: string
      mode: ImageMode
      updatedAt: string
    }
  | {
      type: 'set-image-transform'
      elementId: string
      transform: ImageTransform
      updatedAt: string
    }
  | {
      type: 'set-image-desktop-frame'
      elementId: string
      layout: ElementLayout
      transform: ImageTransform
      updatedAt: string
    }
  | ColorProjectAction
  | HeaderAppearanceAction
  | PageProjectAction
  | NavigationProjectAction
