import type { EditorProjectState } from '../model/editorProject'
import { isImageMode, type ImageMode } from '../model/imagePresentation'

export function setImageMode(
  state: EditorProjectState,
  elementId: string,
  mode: ImageMode,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)

  if (
    !activePage ||
    !element ||
    element.kind !== 'image' ||
    element.locked ||
    !isImageMode(mode) ||
    mode === element.mode
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'image'
              ? { ...candidate, mode }
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
