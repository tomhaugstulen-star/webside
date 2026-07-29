import type { EditorProjectState } from '../model/editorProject'
import {
  imageTransformsEqual,
  normalizeImageTransform,
  type ImageTransform,
} from '../model/imagePresentation'

export function setImageTransform(
  state: EditorProjectState,
  elementId: string,
  transform: ImageTransform,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)
  const normalizedTransform = normalizeImageTransform(transform)

  if (
    !activePage ||
    !element ||
    element.kind !== 'image' ||
    element.locked ||
    !normalizedTransform ||
    imageTransformsEqual(normalizedTransform, element.transform)
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'image'
              ? { ...candidate, transform: normalizedTransform }
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
