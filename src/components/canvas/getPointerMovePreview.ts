import type { ElementLayout } from '../../model/elementLayout'
import type { AlignmentTargets } from './alignmentGuideTypes'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import { snapElementMove } from './snapElementMove'

type GetPointerMovePreviewOptions = {
  layout: ElementLayout
  targets: AlignmentTargets | null
  canvasWidth: number
}

export function getPointerMovePreview({
  layout,
  targets,
  canvasWidth,
}: GetPointerMovePreviewOptions): ElementLayoutPreview {
  const snapResult = targets
    ? snapElementMove({
        layout,
        targets,
        canvasWidth,
      })
    : { layout, guides: [] }

  return {
    elementId: '',
    layout: snapResult.layout,
    guides: snapResult.guides,
  }
}
