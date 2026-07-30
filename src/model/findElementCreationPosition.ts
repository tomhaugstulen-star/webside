import type {
  CanvasPosition,
  EditorElement,
  ElementSize,
} from './editorProject'

const CREATION_ORIGIN: CanvasPosition = { x: 24, y: 24 }
const CREATION_GAP = 16

type VerticalSpan = {
  top: number
  bottom: number
}

function overlapsCreationColumn(element: EditorElement, size: ElementSize) {
  const position = element.position.desktop
  const elementSize = element.size.desktop

  return (
    CREATION_ORIGIN.x < position.x + elementSize.width + CREATION_GAP &&
    CREATION_ORIGIN.x + size.width + CREATION_GAP > position.x
  )
}

function getOccupiedVerticalSpans(
  size: ElementSize,
  existingElements: EditorElement[],
): VerticalSpan[] {
  return existingElements
    .filter((element) => overlapsCreationColumn(element, size))
    .map((element) => {
      const top = element.kind === 'header' ? 0 : element.position.desktop.y

      return {
        top,
        bottom: top + element.size.desktop.height,
      }
    })
    .sort((first, second) => first.top - second.top)
}

export function findElementCreationPosition(
  size: ElementSize,
  existingElements: EditorElement[],
): CanvasPosition {
  const occupiedSpans = getOccupiedVerticalSpans(size, existingElements)
  let y = CREATION_ORIGIN.y

  for (const span of occupiedSpans) {
    const candidateBottomWithGap = y + size.height + CREATION_GAP

    if (candidateBottomWithGap <= span.top) {
      break
    }

    y = Math.max(y, span.bottom + CREATION_GAP)
  }

  return { x: CREATION_ORIGIN.x, y }
}
