import type { EditorElement } from '../../model/editorProject'
import { resolveResponsiveValue, type ResponsiveViewport } from '../../model/resolveResponsiveValue'

const CANVAS_BOTTOM_PADDING = 48

export function getCanvasContentHeight(
  elements: EditorElement[],
  viewport: ResponsiveViewport,
) {
  return elements.reduce((contentHeight, element) => {
    const visible = resolveResponsiveValue(element.visibility, viewport)

    if (!visible) {
      return contentHeight
    }

    const position = resolveResponsiveValue(element.position, viewport)
    const size = resolveResponsiveValue(element.size, viewport)
    const elementBottom = position.y + size.height + CANVAS_BOTTOM_PADDING

    return Math.max(contentHeight, elementBottom)
  }, 0)
}
