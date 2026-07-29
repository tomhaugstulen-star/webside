import { useCallback } from 'react'
import type { ElementLayout } from '../model/elementLayout'
import type { ImageTransform } from '../model/imagePresentation'
import { useEditorProject } from './useEditorProject'

export function useElementLayout() {
  const { dispatch } = useEditorProject()

  const commitElementDesktopLayout = useCallback(
    (elementId: string, layout: ElementLayout) => {
      dispatch({
        type: 'set-element-desktop-layout',
        elementId,
        layout,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const commitImageDesktopFrame = useCallback(
    (
      elementId: string,
      layout: ElementLayout,
      transform: ImageTransform,
    ) => {
      dispatch({
        type: 'set-image-desktop-frame',
        elementId,
        layout,
        transform,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { commitElementDesktopLayout, commitImageDesktopFrame }
}
