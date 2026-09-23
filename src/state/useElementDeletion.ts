import { useCallback } from 'react'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import {
  getElementImageAssetId,
  projectReferencesImageAsset,
} from '../model/projectImageAssets'
import { useEditorProject } from './useEditorProject'

export function useElementDeletion() {
  const { state, activePage, dispatch } = useEditorProject()
  const { removeImageAsset } = useImageAssetStore()

  const deleteElement = useCallback(
    (elementId: string) => {
      const element = activePage.elements.find(
        (candidate) => candidate.id === elementId,
      )

      if (!element || element.locked) return

      const assetId = getElementImageAssetId(element)
      const removeUnreferencedAsset =
        assetId !== null &&
        !projectReferencesImageAsset(state.project, assetId, elementId)

      dispatch({
        type: 'delete-element-from-active-page',
        elementId,
        updatedAt: new Date().toISOString(),
      })

      if (removeUnreferencedAsset) removeImageAsset(assetId)
    },
    [activePage.elements, dispatch, removeImageAsset, state.project],
  )

  return { deleteElement }
}
