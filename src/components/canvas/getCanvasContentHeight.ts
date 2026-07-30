import type { EditorElement, ResponsiveViewport } from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import type { ElementLayoutPreview } from './canvasLayoutPreview'

const CANVAS_BOTTOM_PADDING = 48

export function getCanvasContentHeight(
  elements: EditorElement[],
  viewport: ResponsiveViewport,
  preview: ElementLayoutPreview | null,
) {
  return elements.reduce((contentHeight, element) => {
    const visible = resolveResponsiveValue(element.visibility, viewport)

    if (!visible) {
      return contentHeight
    }

    const previewLayout = preview?.elementId === element.id ? preview.layout : null
    const position = previewLayout
      ? previewLayout.position
      : element.kind === 'header'
        ? { x: 0, y: 0 }
        : resolveResponsiveValue(element.position, viewport)
    const size = previewLayout
      ? previewLayout.size
      : resolveResponsiveValue(element.size, viewport)
    const elementBottom = position.y + size.height + CANVAS_BOTTOM_PADDING

    return Math.max(contentHeight, elementBottom)
  }, 0)
}
