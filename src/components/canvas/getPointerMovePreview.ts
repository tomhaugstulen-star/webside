import type { ElementLayout } from '../../model/elementLayout'
import type { EditorElement } from '../../model/editorProject'
import type { AlignmentTargets } from './alignmentGuideTypes'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import { snapElementMove } from './snapElementMove'

type GetPointerMovePreviewOptions = {
  element: EditorElement
  layout: ElementLayout
  targets: AlignmentTargets | null
  canvasWidth: number
}

export function getPointerMovePreview({
  element,
  layout,
  targets,
  canvasWidth,
}: GetPointerMovePreviewOptions): ElementLayoutPreview {
  const snapResult = targets
    ? snapElementMove({
        layout,
        targets,
        canvasWidth,
        allowHorizontal: element.kind !== 'header',
      })
    : { layout, guides: [] }

  return {
    elementId: element.id,
    layout: snapResult.layout,
    guides: snapResult.guides,
  }
}
