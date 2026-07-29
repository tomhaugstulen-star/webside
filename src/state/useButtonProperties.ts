import { useCallback } from 'react'
import type { ButtonAssetId } from '../model/buttonAsset'
import { useEditorProject } from './useEditorProject'

export function useButtonProperties() {
  const { dispatch } = useEditorProject()

  const updateButtonLabel = useCallback(
    (elementId: string, label: string) => {
      dispatch({
        type: 'set-button-label',
        elementId,
        label,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateButtonAsset = useCallback(
    (elementId: string, assetId: ButtonAssetId) => {
      dispatch({
        type: 'set-button-asset',
        elementId,
        assetId,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { updateButtonLabel, updateButtonAsset }
}
