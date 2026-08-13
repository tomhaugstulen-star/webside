import type { EditorProjectState } from '../model/editorProject'
import { isValidSectionAnchorId } from '../model/siteStructure'

export function setSectionAnchorId(
  state: EditorProjectState,
  elementId: string,
  anchorId: string,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const section = activePage?.elements.find(
    (element) => element.id === elementId && element.kind === 'section',
  )

  if (
    !activePage ||
    !section ||
    section.kind !== 'section' ||
    section.locked ||
    !isValidSectionAnchorId(anchorId) ||
    section.anchorId === anchorId
  ) {
    return state
  }

  const duplicateAnchor = activePage.elements.some(
    (element) =>
      element.kind === 'section' &&
      element.id !== elementId &&
      element.anchorId === anchorId,
  )

  if (duplicateAnchor) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((element) =>
            element.id === elementId && element.kind === 'section'
              ? { ...element, anchorId }
              : element,
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
