import type { EditorProjectState } from '../model/editorProject'
import { isImageFit, type ImageFit } from '../model/imageAsset'

export function setImageFit(
  state: EditorProjectState,
  elementId: string,
  fit: ImageFit,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)

  if (
    !activePage ||
    !element ||
    element.kind !== 'image' ||
    element.locked ||
    !isImageFit(fit) ||
    fit === element.fit
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'image'
              ? { ...candidate, fit }
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
