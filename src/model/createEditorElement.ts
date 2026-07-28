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

const creationPositions: CanvasPosition[] = [
  { x: 24, y: 24 },
  { x: 36, y: 48 },
  { x: 48, y: 72 },
  { x: 60, y: 96 },
]

export function createEditorElement(
  kind: ElementKind,
  existingElementCount: number,
): EditorElement {
  const position = creationPositions[existingElementCount % creationPositions.length]
  const size = defaultElementSizes[kind]

  return {
    id: createStableId(),
    kind,
    position: { desktop: { ...position } },
    size: { desktop: { ...size } },
    visibility: { desktop: true },
    locked: false,
  }
}
