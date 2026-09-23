import { DEFAULT_BUTTON_LABEL } from './buttonAsset'
import { getDefaultElementSize } from './elementDimensions'
import type { ElementCreationRequest } from './elementCreation'
import type { EditorElement } from './editorProject'
import { NO_ELEMENT_LINK } from './elementLink'
import { findElementCreationPosition } from './findElementCreationPosition'
import { DEFAULT_HEADER_APPEARANCE } from './headerAppearance'
import { DEFAULT_HERO_APPEARANCE } from './heroAppearance'
import {
  DEFAULT_HERO_CTA_LABEL,
  DEFAULT_HERO_SUBTITLE,
  DEFAULT_HERO_TITLE,
} from './heroElement'
import {
  DEFAULT_IMAGE_MODE,
  DEFAULT_IMAGE_TRANSFORM,
} from './imagePresentation'
import { DEFAULT_SECTION_APPEARANCE } from './sectionAppearance'
import { createUniqueSectionAnchorId } from './siteStructure'
import { DEFAULT_TEXT_APPEARANCE } from './textAppearance'
import { DEFAULT_TEXT_ELEMENT_STYLE } from './textElementStyle'

type CreateEditorElementInput = {
  id: string
  request: ElementCreationRequest
  existingElements: EditorElement[]
}

export function createEditorElement({
  id,
  request,
  existingElements,
}: CreateEditorElementInput): EditorElement {
  const size = getDefaultElementSize(request.kind)
  const position =
    request.kind === 'header'
      ? { x: 0, y: 0 }
      : findElementCreationPosition(size, existingElements)
  const common = {
    id,
    position: { desktop: position },
    size: { desktop: { ...size } },
    visibility: { desktop: true },
    locked: false,
  }

  switch (request.kind) {
    case 'section': {
      const anchorId = createUniqueSectionAnchorId(
        existingElements
          .filter((element) => element.kind === 'section')
          .map((element) => element.anchorId),
      )

      return {
        ...common,
        kind: 'section',
        anchorId,
        appearance: {
          backgroundFill: { ...DEFAULT_SECTION_APPEARANCE.backgroundFill },
          frame: { ...DEFAULT_SECTION_APPEARANCE.frame },
        },
      }
    }
    case 'image':
      return {
        ...common,
        kind: 'image',
        assetId: request.assetId,
        assetMetadata: { ...request.assetMetadata },
        altText: '',
        mode: DEFAULT_IMAGE_MODE,
        transform: { ...DEFAULT_IMAGE_TRANSFORM },
      }
    case 'text':
      return {
        ...common,
        kind: 'text',
        content: '',
        appearance: {
          backgroundFill: { ...DEFAULT_TEXT_APPEARANCE.backgroundFill },
          frame: { ...DEFAULT_TEXT_APPEARANCE.frame },
        },
        textStyle: { ...DEFAULT_TEXT_ELEMENT_STYLE },
        link: { ...NO_ELEMENT_LINK },
      }
    case 'button':
      return {
        ...common,
        kind: 'button',
        assetId: request.assetId,
        label: DEFAULT_BUTTON_LABEL,
        link: { ...NO_ELEMENT_LINK },
      }
    case 'header':
      return {
        ...common,
        kind: 'header',
        logoAssetId: request.logoAssetId,
        logoAssetMetadata: { ...request.logoAssetMetadata },
        siteName: request.siteName,
        subtitle: request.subtitle,
        appearance: {
          backgroundFill: { ...DEFAULT_HEADER_APPEARANCE.backgroundFill },
          textColor: DEFAULT_HEADER_APPEARANCE.textColor,
          fontFamily: DEFAULT_HEADER_APPEARANCE.fontFamily,
          fontSize: DEFAULT_HEADER_APPEARANCE.fontSize,
          frame: { ...DEFAULT_HEADER_APPEARANCE.frame },
        },
      }
    case 'hero':
      return {
        ...common,
        kind: 'hero',
        imageAssetId: request.imageAssetId,
        imageAssetMetadata: { ...request.imageAssetMetadata },
        title: DEFAULT_HERO_TITLE,
        subtitle: DEFAULT_HERO_SUBTITLE,
        ctaLabel: DEFAULT_HERO_CTA_LABEL,
        ctaLink: { ...NO_ELEMENT_LINK },
        appearance: {
          backgroundFill: { ...DEFAULT_HERO_APPEARANCE.backgroundFill },
          textColor: DEFAULT_HERO_APPEARANCE.textColor,
          frame: { ...DEFAULT_HERO_APPEARANCE.frame },
        },
      }
  }

  const unhandledRequest: never = request
  return unhandledRequest
}
