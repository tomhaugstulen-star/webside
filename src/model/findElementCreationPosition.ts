import type {
  CanvasPosition,
  EditorElement,
  ElementSize,
  SectionEditorElement,
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

export function findPositionInSection(
  section: SectionEditorElement,
  size: ElementSize,
  existingElements: readonly EditorElement[],
): CanvasPosition | null {
  const inset = 8
  const gap = 8
  const x = section.position.desktop.x + inset
  const right = section.position.desktop.x + section.size.desktop.width - inset
  const bottom = section.position.desktop.y + section.size.desktop.height - inset
  if (x + size.width > right) return null

  let y = section.position.desktop.y + inset
  const occupied = existingElements
    .filter((element) => element.kind !== 'section' && element.kind !== 'header')
    .filter((element) => {
      const position = element.position.desktop
      return position.x < x + size.width && position.x + element.size.desktop.width > x
    })
    .sort((first, second) => first.position.desktop.y - second.position.desktop.y)

  for (const element of occupied) {
    const top = element.position.desktop.y
    if (y + size.height <= top) break
    if (y < top + element.size.desktop.height) {
      y = top + element.size.desktop.height + gap
    }
  }

  return y + size.height <= bottom ? { x, y } : null
}
