import type { EditorProjectState } from '../model/editorProject'
import { normalizeImageAltText } from '../model/imageAsset'

export function setImageAltText(
  state: EditorProjectState,
  elementId: string,
  altText: string,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)
  const normalizedAltText = normalizeImageAltText(altText)

  if (
    !activePage ||
    !element ||
    element.kind !== 'image' ||
    element.locked ||
    normalizedAltText === element.altText
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'image'
              ? { ...candidate, altText: normalizedAltText }
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
