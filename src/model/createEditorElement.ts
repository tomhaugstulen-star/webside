import type {
  CanvasPosition,
  EditorElement,
  ElementKind,
  ElementSize,
} from './editorProject'
import { createStableId } from './createStableId'

const defaultElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 320, height: 180 },
  image: { width: 240, height: 160 },
  text: { width: 240, height: 96 },
  button: { width: 160, height: 48 },
}

const CREATION_SLOT_COUNT = 16

function getCreationPosition(existingElementCount: number): CanvasPosition {
  const safeElementCount = Math.max(0, existingElementCount)
  const slot = safeElementCount % CREATION_SLOT_COUNT

  return {
    x: 24 + (slot % 4) * 12,
    y: 24 + slot * 24,
  }
}

export function createEditorElement(
  kind: ElementKind,
  existingElementCount: number,
): EditorElement {
  const position = getCreationPosition(existingElementCount)
  const size = defaultElementSizes[kind]

  return {
    id: createStableId(),
    kind,
    position: { desktop: position },
    size: { desktop: { ...size } },
    visibility: { desktop: true },
    locked: false,
  }
}
