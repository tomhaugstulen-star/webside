import { DEFAULT_BUTTON_LABEL } from './buttonAsset'
import { getDefaultElementSize } from './elementDimensions'
import type { ElementCreationRequest } from './elementCreation'
import type { EditorElement } from './editorProject'
import { NO_ELEMENT_LINK } from './elementLink'
import { findElementCreationPosition } from './findElementCreationPosition'
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
  const position = findElementCreationPosition(size, existingElements)
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
      }
  }

  const unhandledRequest: never = request
  return unhandledRequest
}
