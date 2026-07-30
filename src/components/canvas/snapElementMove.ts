import {
  moveElementLayout,
  type ElementLayout,
} from '../../model/elementLayout'
import type {
  AlignmentAnchor,
  AlignmentAxis,
  AlignmentGuide,
  AlignmentTarget,
  AlignmentTargets,
  MoveSnapResult,
} from './alignmentGuideTypes'

export const ALIGNMENT_SNAP_THRESHOLD = 6

const ACTIVE_ANCHORS: AlignmentAnchor[] = ['start', 'center', 'end']

const ANCHOR_PRIORITY: Record<AlignmentAnchor, number> = {
  center: 0,
  start: 1,
  end: 2,
}

const SOURCE_PRIORITY = {
  canvas: 0,
  element: 1,
} as const

type SnapElementMoveOptions = {
  layout: ElementLayout
  targets: AlignmentTargets
  canvasWidth: number
  threshold?: number
}

type SnapMatch = {
  axis: AlignmentAxis
  activeAnchor: AlignmentAnchor
  delta: number
  target: AlignmentTarget
}

function getAnchorCoordinate(
  layout: ElementLayout,
  axis: AlignmentAxis,
  anchor: AlignmentAnchor,
) {
  const start = axis === 'x' ? layout.position.x : layout.position.y
  const size = axis === 'x' ? layout.size.width : layout.size.height

  if (anchor === 'start') return start
  if (anchor === 'center') return start + size / 2
  return start + size
}

function canApplyDelta(
  layout: ElementLayout,
  axis: AlignmentAxis,
  delta: number,
  canvasWidth: number,
) {
  if (axis === 'y') {
    return layout.position.y + delta >= 0
  }

  const nextX = layout.position.x + delta
  const maximumX = Math.max(0, canvasWidth - layout.size.width)
  return nextX >= 0 && nextX <= maximumX
}

function compareOptionalText(first?: string, second?: string) {
  const normalizedFirst = first ?? ''
  const normalizedSecond = second ?? ''

  if (normalizedFirst === normalizedSecond) return 0
  return normalizedFirst < normalizedSecond ? -1 : 1
}

function isPreferredMatch(candidate: SnapMatch, current: SnapMatch | null) {
  if (!current) return true

  const distanceDifference = Math.abs(candidate.delta) - Math.abs(current.delta)
  if (distanceDifference !== 0) return distanceDifference < 0

  const activeAnchorDifference =
    ANCHOR_PRIORITY[candidate.activeAnchor] -
    ANCHOR_PRIORITY[current.activeAnchor]
  if (activeAnchorDifference !== 0) return activeAnchorDifference < 0

  const targetAnchorDifference =
    ANCHOR_PRIORITY[candidate.target.anchor] -
    ANCHOR_PRIORITY[current.target.anchor]
  if (targetAnchorDifference !== 0) return targetAnchorDifference < 0

  const sourceDifference =
    SOURCE_PRIORITY[candidate.target.source] -
    SOURCE_PRIORITY[current.target.source]
  if (sourceDifference !== 0) return sourceDifference < 0

  if (candidate.target.coordinate !== current.target.coordinate) {
    return candidate.target.coordinate < current.target.coordinate
  }

  return (
    compareOptionalText(
      candidate.target.targetElementId,
      current.target.targetElementId,
    ) < 0
  )
}

function findBestMatch(
  layout: ElementLayout,
  axis: AlignmentAxis,
  targets: AlignmentTarget[],
  canvasWidth: number,
  threshold: number,
): SnapMatch | null {
  let bestMatch: SnapMatch | null = null

  for (const activeAnchor of ACTIVE_ANCHORS) {
    const activeCoordinate = getAnchorCoordinate(layout, axis, activeAnchor)

    for (const target of targets) {
      const delta = target.coordinate - activeCoordinate
      const candidate: SnapMatch = { axis, activeAnchor, delta, target }

      if (
        Math.abs(delta) <= threshold &&
        canApplyDelta(layout, axis, delta, canvasWidth) &&
        isPreferredMatch(candidate, bestMatch)
      ) {
        bestMatch = candidate
      }
    }
  }

  return bestMatch
}

function createGuide(match: SnapMatch, layout: ElementLayout): AlignmentGuide {
  const activeStart =
    match.axis === 'x' ? layout.position.y : layout.position.x
  const activeEnd =
    activeStart +
    (match.axis === 'x' ? layout.size.height : layout.size.width)

  return {
    axis: match.axis,
    coordinate: match.target.coordinate,
    start: Math.min(activeStart, match.target.start),
    end: Math.max(activeEnd, match.target.end),
    source: match.target.source,
    targetElementId: match.target.targetElementId,
  }
}

export function snapElementMove({
  layout,
  targets,
  canvasWidth,
  threshold = ALIGNMENT_SNAP_THRESHOLD,
}: SnapElementMoveOptions): MoveSnapResult {
  const xMatch = findBestMatch(
    layout,
    'x',
    targets.x,
    canvasWidth,
    threshold,
  )
  const yMatch = findBestMatch(
    layout,
    'y',
    targets.y,
    canvasWidth,
    threshold,
  )
  const snappedLayout = moveElementLayout(
    layout,
    {
      x: xMatch ? xMatch.delta : 0,
      y: yMatch ? yMatch.delta : 0,
    },
    canvasWidth,
  )
  const guides: AlignmentGuide[] = []

  if (xMatch) guides.push(createGuide(xMatch, snappedLayout))
  if (yMatch) guides.push(createGuide(yMatch, snappedLayout))

  return { layout: snappedLayout, guides }
}
