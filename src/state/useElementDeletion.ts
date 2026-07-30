import { useCallback } from 'react'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import type { EditorElement, EditorProject } from '../model/editorProject'
import type { ImageAssetId } from '../model/imageAsset'
import { useEditorProject } from './useEditorProject'

function getElementImageAssetId(element: EditorElement): ImageAssetId | null {
  if (element.kind === 'image') return element.assetId
  if (element.kind === 'header') return element.logoAssetId
  return null
}

function projectReferencesImageAsset(
  project: EditorProject,
  assetId: ImageAssetId,
  excludedElementId: string,
) {
  return project.pages.some((page) =>
    page.elements.some(
      (element) =>
        element.id !== excludedElementId &&
        getElementImageAssetId(element) === assetId,
    ),
  )
}

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
