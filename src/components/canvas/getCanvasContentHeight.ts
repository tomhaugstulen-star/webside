import type { EditorElement, ResponsiveViewport } from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import { resolveResponsiveElementLayout } from '../../model/resolveResponsiveElementLayout'
import type { ElementLayoutPreview } from './canvasLayoutPreview'

const CANVAS_BOTTOM_PADDING = 48

export function getCanvasContentHeight(
  elements: EditorElement[],
  viewport: ResponsiveViewport,
  canvasWidth: number,
  preview: ElementLayoutPreview | null,
) {
  return elements.reduce((contentHeight, element) => {
    const visible = resolveResponsiveValue(element.visibility, viewport)

    if (!visible) {
      return contentHeight
    }

    const previewLayout = preview?.elementId === element.id ? preview.layout : null
    const layout =
      previewLayout ??
      resolveResponsiveElementLayout(element, viewport, canvasWidth)
    const elementBottom =
      layout.position.y + layout.size.height + CANVAS_BOTTOM_PADDING

    return Math.max(contentHeight, elementBottom)
  }, 0)
}
