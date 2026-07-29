import type { EditorProjectState } from '../model/editorProject'
import {
  elementLinksEqual,
  isValidElementLink,
  type ElementLink,
} from '../model/elementLink'

export function setElementLink(
  state: EditorProjectState,
  elementId: string,
  link: ElementLink,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)

  if (
    !activePage ||
    !element ||
    (element.kind !== 'text' && element.kind !== 'button') ||
    element.locked ||
    !isValidElementLink(link) ||
    elementLinksEqual(element.link, link)
  ) {
    return state
  }

  const nextLink: ElementLink =
    link.type === 'none'
      ? { type: 'none' }
      : {
          type: 'external-url',
          url: link.url,
          openInNewTab: link.openInNewTab,
        }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId &&
            (candidate.kind === 'text' || candidate.kind === 'button')
              ? { ...candidate, link: nextLink }
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
