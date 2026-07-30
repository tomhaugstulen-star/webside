import type { ElementLayout } from '../../model/elementLayout'

export type AlignmentAxis = 'x' | 'y'

export type AlignmentAnchor = 'start' | 'center' | 'end'

export type AlignmentGuideSource = 'element' | 'canvas'

export type AlignmentTarget = {
  axis: AlignmentAxis
  anchor: AlignmentAnchor
  coordinate: number
  start: number
  end: number
  source: AlignmentGuideSource
  targetElementId?: string
}

export type AlignmentTargets = Record<AlignmentAxis, AlignmentTarget[]>

export type AlignmentGuide = {
  axis: AlignmentAxis
  coordinate: number
  start: number
  end: number
  source: AlignmentGuideSource
  targetElementId?: string
}

export type MoveSnapResult = {
  layout: ElementLayout
  guides: AlignmentGuide[]
}
