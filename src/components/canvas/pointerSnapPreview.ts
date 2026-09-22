import type { ElementLayout } from '../../model/elementLayout'
import type {
  EditorElement,
  ResponsiveViewport,
} from '../../model/editorProject'
import type { AlignmentTargets } from './alignmentGuideTypes'
import type { PointerInteraction, TransformMode } from './elementPointerTransform'
import { getAlignmentTargets } from './getAlignmentTargets'
import { getPointerMovePreview } from './getPointerMovePreview'
import {
  getResizeSizeTargets,
  type ResizeSizeTarget,
} from './resizeSizeTargets'
import { snapElementResize } from './snapElementResize'
import type { ElementLayoutPreview } from './canvasLayoutPreview'

export type PointerSnapTargets = {
  alignment: AlignmentTargets | null
  resize: ResizeSizeTarget[]
}

type GetPointerSnapTargetsOptions = {
  mode: TransformMode
  elements: EditorElement[]
  activeElementId: string
  viewport: ResponsiveViewport
  canvasWidth: number
  canvasHeight: number
}

export function getPointerSnapTargets({
  mode,
  elements,
  activeElementId,
  viewport,
  canvasWidth,
  canvasHeight,
}: GetPointerSnapTargetsOptions): PointerSnapTargets {
  if (mode === 'move') {
    return {
      alignment: getAlignmentTargets({
        elements,
        activeElementId,
        viewport,
        canvasWidth,
        canvasHeight,
      }),
      resize: [],
    }
  }

  return {
    alignment: null,
    resize: getResizeSizeTargets({
      elements,
      activeElementId,
      viewport,
      canvasWidth,
    }),
  }
}

type GetPointerSnapPreviewOptions = {
  element: EditorElement
  interaction: PointerInteraction
  layout: ElementLayout
  targets: PointerSnapTargets | null
}

export function getPointerSnapPreview({
  element,
  interaction,
  layout,
  targets,
}: GetPointerSnapPreviewOptions): ElementLayoutPreview {
  if (interaction.mode === 'move') {
    return getPointerMovePreview({
      elementId: element.id,
      layout,
      targets: targets?.alignment ?? null,
      canvasWidth: interaction.canvasWidth,
    })
  }

  const result = snapElementResize({
    element,
    layout,
    handle: interaction.resizeHandle,
    targets: targets?.resize ?? [],
    canvasWidth: interaction.canvasWidth,
  })

  return {
    elementId: element.id,
    layout: result.layout,
    guides: result.guides,
  }
}
