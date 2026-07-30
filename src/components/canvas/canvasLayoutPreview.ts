import {
  elementLayoutsEqual,
  type ElementLayout,
} from '../../model/elementLayout'
import type { AlignmentGuide } from './alignmentGuideTypes'

export type ElementLayoutPreview = {
  elementId: string
  layout: ElementLayout
  guides: AlignmentGuide[]
}

function alignmentGuidesEqual(
  first: AlignmentGuide[],
  second: AlignmentGuide[],
) {
  return (
    first.length === second.length &&
    first.every((guide, index) => {
      const other = second[index]

      return (
        other !== undefined &&
        guide.axis === other.axis &&
        guide.coordinate === other.coordinate &&
        guide.start === other.start &&
        guide.end === other.end &&
        guide.source === other.source &&
        guide.targetElementId === other.targetElementId
      )
    })
  )
}

export function elementLayoutPreviewsEqual(
  first: ElementLayoutPreview,
  second: ElementLayoutPreview,
) {
  return (
    first.elementId === second.elementId &&
    elementLayoutsEqual(first.layout, second.layout) &&
    alignmentGuidesEqual(first.guides, second.guides)
  )
}
