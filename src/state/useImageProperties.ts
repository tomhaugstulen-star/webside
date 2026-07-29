import { useCallback } from 'react'
import type { ImageFit } from '../model/imageAsset'
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

  const updateImageFit = useCallback(
    (elementId: string, fit: ImageFit) => {
      dispatch({
        type: 'set-image-fit',
        elementId,
        fit,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { updateImageAltText, updateImageFit }
}
