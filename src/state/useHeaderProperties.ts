import { useCallback } from 'react'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'
import { useEditorProject } from './useEditorProject'

export function useHeaderProperties() {
  const { dispatch } = useEditorProject()

  const updateHeaderContent = useCallback(
    (elementId: string, siteName: string, subtitle: string) => {
      dispatch({
        type: 'set-header-content',
        elementId,
        siteName,
        subtitle,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateHeaderLogo = useCallback(
    (
      elementId: string,
      logoAssetId: ImageAssetId,
      logoAssetMetadata: ImageAssetMetadata,
    ) => {
      dispatch({
        type: 'set-header-logo',
        elementId,
        logoAssetId,
        logoAssetMetadata,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { updateHeaderContent, updateHeaderLogo }
}
