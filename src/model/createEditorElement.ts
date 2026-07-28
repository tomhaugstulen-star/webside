import type { EditorElement, ElementKind, ElementSize } from './editorProject'
import { findElementCreationPosition } from './findElementCreationPosition'

const defaultElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 320, height: 180 },
  image: { width: 240, height: 160 },
  text: { width: 240, height: 96 },
  button: { width: 160, height: 48 },
}

type CreateEditorElementInput = {
  id: string
  kind: ElementKind
  existingElements: EditorElement[]
}

export function createEditorElement({
  id,
  kind,
  existingElements,
}: CreateEditorElementInput): EditorElement {
  const size = defaultElementSizes[kind]
  const position = findElementCreationPosition(size, existingElements)
  const common = {
    id,
    position: { desktop: position },
    size: { desktop: { ...size } },
    visibility: { desktop: true },
    locked: false,
  }

  switch (kind) {
    case 'section':
      return { ...common, kind }
    case 'image':
      return { ...common, kind }
    case 'text':
      return { ...common, kind, content: '' }
    case 'button':
      return { ...common, kind }
  }

  const unhandledKind: never = kind
  return unhandledKind
}
