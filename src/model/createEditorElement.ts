import type { EditorElement, ElementKind, ElementSize } from './editorProject'
import { createStableId } from './createStableId'
import { findElementCreationPosition } from './findElementCreationPosition'

const defaultElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 320, height: 180 },
  image: { width: 240, height: 160 },
  text: { width: 240, height: 96 },
  button: { width: 160, height: 48 },
}

export function createEditorElement(
  kind: ElementKind,
  existingElements: EditorElement[],
): EditorElement {
  const size = defaultElementSizes[kind]
  const position = findElementCreationPosition(size, existingElements)

  return {
    id: createStableId(),
    kind,
    position: { desktop: position },
    size: { desktop: { ...size } },
    visibility: { desktop: true },
    locked: false,
  }
}
