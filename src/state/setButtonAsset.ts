import {
  isKnownButtonAssetId,
  type ButtonAssetId,
} from '../model/buttonAsset'
import type { EditorProjectState } from '../model/editorProject'

export function setButtonAsset(
  state: EditorProjectState,
  elementId: string,
  assetId: ButtonAssetId,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)

  if (
    !activePage ||
    !element ||
    element.kind !== 'button' ||
    element.locked ||
    !isKnownButtonAssetId(assetId) ||
    assetId === element.assetId
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'button'
              ? { ...candidate, assetId }
              : candidate,
          ),
        }
      : page,
  )

  return {
    ...state,
    project: {
      ...state.project,
      pages,
      updatedAt,
    },
  }
}
