import type { EditorProjectState } from '../model/editorProject'
import {
  isImageMode,
  normalizeImageTransformForFrame,
  type ImageMode,
} from '../model/imagePresentation'

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

  const transform =
    mode === 'crop'
      ? normalizeImageTransformForFrame(
          element.transform,
          element.assetMetadata,
          element.size.desktop,
        ) ?? element.transform
      : element.transform
  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'image'
              ? { ...candidate, mode, transform }
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
