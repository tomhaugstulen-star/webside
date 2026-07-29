import { useCallback } from 'react'
import type { ImageMode, ImageTransform } from '../model/imagePresentation'
import { useEditorProject } from './useEditorProject'

export function useImageProperties() {
  const { dispatch } = useEditorProject()

  const updateImageAltText = useCallback(
    (elementId: string, altText: string) => {
      dispatch({
        type: 'set-image-alt-text',
        elementId,
        altText,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateImageMode = useCallback(
    (elementId: string, mode: ImageMode) => {
      dispatch({
        type: 'set-image-mode',
        elementId,
        mode,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateImageTransform = useCallback(
    (elementId: string, transform: ImageTransform) => {
      dispatch({
        type: 'set-image-transform',
        elementId,
        transform,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return {
    updateImageAltText,
    updateImageMode,
    updateImageTransform,
  }
}
