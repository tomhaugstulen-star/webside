import type {
  CanvasPosition,
  EditorElement,
  ElementSize,
} from './editorProject'

const CREATION_ORIGIN: CanvasPosition = { x: 24, y: 24 }
const CREATION_GAP = 16
const CREATION_ROW_STEP = 24
const CREATION_X_OFFSETS = [0, 12, 24] as const
const MINIMUM_CANDIDATE_COUNT = 64
const CANDIDATES_PER_EXISTING_ELEMENT = 16

function overlapsExistingElement(
  position: CanvasPosition,
  size: ElementSize,
  element: EditorElement,
) {
  const existingPosition = element.position.desktop
  const existingSize = element.size.desktop

  return (
    position.x < existingPosition.x + existingSize.width + CREATION_GAP &&
    position.x + size.width + CREATION_GAP > existingPosition.x &&
    position.y < existingPosition.y + existingSize.height + CREATION_GAP &&
    position.y + size.height + CREATION_GAP > existingPosition.y
  )
}

function createCandidatePosition(candidateIndex: number): CanvasPosition {
  const columnIndex = candidateIndex % CREATION_X_OFFSETS.length
  const rowIndex = Math.floor(candidateIndex / CREATION_X_OFFSETS.length)

  return {
    x: CREATION_ORIGIN.x + CREATION_X_OFFSETS[columnIndex],
    y: CREATION_ORIGIN.y + rowIndex * CREATION_ROW_STEP,
  }
}

function createFallbackPosition(existingElements: EditorElement[]): CanvasPosition {
  const lowestElementEdge = existingElements.reduce((lowestEdge, element) => {
    const position = element.position.desktop
    const size = element.size.desktop
    return Math.max(lowestEdge, position.y + size.height)
  }, CREATION_ORIGIN.y)

  return {
    x: CREATION_ORIGIN.x,
    y: lowestElementEdge + CREATION_GAP,
  }
}

export function findElementCreationPosition(
  size: ElementSize,
  existingElements: EditorElement[],
): CanvasPosition {
  const candidateCount = Math.max(
    MINIMUM_CANDIDATE_COUNT,
    existingElements.length * CANDIDATES_PER_EXISTING_ELEMENT,
  )

  for (let candidateIndex = 0; candidateIndex < candidateCount; candidateIndex += 1) {
    const candidate = createCandidatePosition(candidateIndex)
    const overlaps = existingElements.some((element) =>
      overlapsExistingElement(candidate, size, element),
    )

    if (!overlaps) {
      return candidate
    }
  }

  return createFallbackPosition(existingElements)
}
