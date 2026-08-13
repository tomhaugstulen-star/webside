import { useCallback } from 'react'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import { createStableId } from '../model/createStableId'
import type { EditorElement, EditorProject } from '../model/editorProject'
import type { ImageAssetId } from '../model/imageAsset'
import { useEditorProject } from './useEditorProject'

function getElementImageAssetId(element: EditorElement): ImageAssetId | null {
  if (element.kind === 'image') return element.assetId
  if (element.kind === 'header') return element.logoAssetId
  return null
}

function getAssetsReleasedByPageDeletion(
  project: EditorProject,
  pageId: string,
): ImageAssetId[] {
  const page = project.pages.find((candidate) => candidate.id === pageId)

  if (!page || project.pages.length <= 1) {
    return []
  }

  const candidates = new Set(
    page.elements
      .map(getElementImageAssetId)
      .filter((assetId): assetId is ImageAssetId => assetId !== null),
  )

  return [...candidates].filter(
    (assetId) =>
      !project.pages.some(
        (candidate) =>
          candidate.id !== pageId &&
          candidate.elements.some(
            (element) => getElementImageAssetId(element) === assetId,
          ),
      ),
  )
}

export function usePageActions() {
  const { state, dispatch } = useEditorProject()
  const { removeImageAsset } = useImageAssetStore()

  const addPage = useCallback(
    (name: string, slug: string) => {
      dispatch({
        type: 'add-page',
        pageId: createStableId(),
        name,
        slug,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const setPageName = useCallback(
    (pageId: string, name: string) => {
      dispatch({
        type: 'set-page-name',
        pageId,
        name,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const setPageSlug = useCallback(
    (pageId: string, slug: string) => {
      dispatch({
        type: 'set-page-slug',
        pageId,
        slug,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const movePage = useCallback(
    (pageId: string, direction: 'up' | 'down') => {
      dispatch({
        type: 'move-page',
        pageId,
        direction,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const deletePage = useCallback(
    (pageId: string) => {
      const releasedAssets = getAssetsReleasedByPageDeletion(
        state.project,
        pageId,
      )

      if (
        !state.project.pages.some((page) => page.id === pageId) ||
        state.project.pages.length <= 1
      ) {
        return
      }

      dispatch({
        type: 'delete-page',
        pageId,
        updatedAt: new Date().toISOString(),
      })

      releasedAssets.forEach(removeImageAsset)
    },
    [dispatch, removeImageAsset, state.project],
  )

  return { addPage, setPageName, setPageSlug, movePage, deletePage }
}
