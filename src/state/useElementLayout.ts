import { useCallback } from 'react'
import type { ElementLayout } from '../model/elementLayout'
import type { ResponsiveViewport } from '../model/editorProject'
import type { ImageTransform } from '../model/imagePresentation'
import { useEditorProject } from './useEditorProject'

export function useElementLayout() {
  const { dispatch } = useEditorProject()

  const commitElementLayout = useCallback(
    (
      elementId: string,
      viewport: ResponsiveViewport,
      layout: ElementLayout,
    ) => {
      dispatch({
        type: 'set-element-viewport-layout',
        elementId,
        viewport,
        layout,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const commitImageFrame = useCallback(
    (
      elementId: string,
      viewport: ResponsiveViewport,
      layout: ElementLayout,
      transform: ImageTransform,
    ) => {
      dispatch({
        type: 'set-image-viewport-frame',
        elementId,
        viewport,
        layout,
        transform,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { commitElementLayout, commitImageFrame }
}
