import type { ElementLayout } from '../../model/elementLayout'
import type {
  EditorElement,
  ResponsiveViewport,
} from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'

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

function getResolvedLayout(
  element: EditorElement,
  viewport: ResponsiveViewport,
  canvasWidth: number,
): ElementLayout {
  const position = resolveResponsiveValue(element.position, viewport)
  const size = resolveResponsiveValue(element.size, viewport)

  return element.kind === 'header'
    ? {
        position: { x: 0, y: 0 },
        size: { width: canvasWidth, height: size.height },
      }
    : { position, size }
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
        layout: getResolvedLayout(element, viewport, canvasWidth),
      },
    ]
  })
}
