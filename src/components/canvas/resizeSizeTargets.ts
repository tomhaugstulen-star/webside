import type { ElementLayout } from '../../model/elementLayout'
import type {
  EditorElement,
  ResponsiveViewport,
} from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import { resolveResponsiveElementLayout } from '../../model/resolveResponsiveElementLayout'

export type ResizeSizeTarget = {
  elementId: string
  layout: ElementLayout
}

type GetResizeSizeTargetsOptions = {
  elements: EditorElement[]
  activeElementId: string
  viewport: ResponsiveViewport
  canvasWidth: number
}

export function getResizeSizeTargets({
  elements,
  activeElementId,
  viewport,
  canvasWidth,
}: GetResizeSizeTargetsOptions): ResizeSizeTarget[] {
  return elements.flatMap((element) => {
    if (
      element.id === activeElementId ||
      !resolveResponsiveValue(element.visibility, viewport)
    ) {
      return []
    }

    return [
      {
        elementId: element.id,
        layout: resolveResponsiveElementLayout(element, viewport, canvasWidth),
      },
    ]
  })
}
