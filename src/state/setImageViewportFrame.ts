import type {
  EditorProjectState,
  ResponsiveViewport,
} from '../model/editorProject'
import type { ElementLayout } from '../model/elementLayout'
import type { ImageTransform } from '../model/imagePresentation'
import { setElementViewportLayout } from './setElementViewportLayout'
import { setImageDesktopFrame } from './setImageDesktopFrame'

export function setImageViewportFrame(
  state: EditorProjectState,
  elementId: string,
  viewport: ResponsiveViewport,
  layout: ElementLayout,
  transform: ImageTransform,
  updatedAt: string,
) {
  if (viewport === 'desktop') {
    return setImageDesktopFrame(
      state,
      elementId,
      layout,
      transform,
      updatedAt,
    )
  }

  return setElementViewportLayout(
    state,
    elementId,
    viewport,
    layout,
    updatedAt,
  )
}
