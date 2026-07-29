import { DEFAULT_BUTTON_LABEL } from './buttonAsset'
import type { ElementCreationRequest } from './elementCreation'
import type { EditorElement, ElementKind, ElementSize } from './editorProject'
import { NO_ELEMENT_LINK } from './elementLink'
import { findElementCreationPosition } from './findElementCreationPosition'
import { DEFAULT_IMAGE_FIT } from './imageAsset'
import { DEFAULT_TEXT_ELEMENT_STYLE } from './textElementStyle'

const defaultElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 320, height: 180 },
  image: { width: 240, height: 160 },
  text: { width: 240, height: 96 },
  button: { width: 160, height: 48 },
}

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
  const size = defaultElementSizes[request.kind]
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
      return { ...common, kind: 'section' }
    case 'image':
      return {
        ...common,
        kind: 'image',
        assetId: request.assetId,
        assetMetadata: { ...request.assetMetadata },
        altText: '',
        fit: DEFAULT_IMAGE_FIT,
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
  }

  const unhandledRequest: never = request
  return unhandledRequest
}
