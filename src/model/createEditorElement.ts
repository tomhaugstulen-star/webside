import { DEFAULT_BUTTON_LABEL } from './buttonAsset'
import { getDefaultElementSize } from './elementDimensions'
import type { ElementCreationRequest } from './elementCreation'
import type { EditorElement } from './editorProject'
import { NO_ELEMENT_LINK } from './elementLink'
import { findElementCreationPosition } from './findElementCreationPosition'
import { DEFAULT_HEADER_APPEARANCE } from './headerAppearance'
import {
  DEFAULT_IMAGE_MODE,
  DEFAULT_IMAGE_TRANSFORM,
} from './imagePresentation'
import { DEFAULT_SECTION_APPEARANCE } from './sectionAppearance'
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
  const creationPosition = findElementCreationPosition(size, existingElements)
  const position =
    request.kind === 'header'
      ? { x: 0, y: creationPosition.y }
      : creationPosition
  const common = {
    id,
    position: { desktop: position },
    size: { desktop: { ...size } },
    visibility: { desktop: true },
    locked: false,
  }

  switch (request.kind) {
    case 'section':
      return {
        ...common,
        kind: 'section',
        appearance: {
          backgroundColor: DEFAULT_SECTION_APPEARANCE.backgroundColor,
          frame: { ...DEFAULT_SECTION_APPEARANCE.frame },
        },
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
          backgroundColor: DEFAULT_HEADER_APPEARANCE.backgroundColor,
          textColor: DEFAULT_HEADER_APPEARANCE.textColor,
          fontFamily: DEFAULT_HEADER_APPEARANCE.fontFamily,
          fontSize: DEFAULT_HEADER_APPEARANCE.fontSize,
          frame: { ...DEFAULT_HEADER_APPEARANCE.frame },
        },
      }
  }

  const unhandledRequest: never = request
  return unhandledRequest
}
