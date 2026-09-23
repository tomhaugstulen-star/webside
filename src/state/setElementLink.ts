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
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )
  const existingLink =
    element?.kind === 'hero'
      ? element.ctaLink
      : element?.kind === 'text' || element?.kind === 'button'
        ? element.link
        : null

  if (
    !activePage ||
    !element ||
    existingLink === null ||
    element.locked ||
    !isValidElementLink(link) ||
    elementLinksEqual(existingLink, link)
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
          elements: page.elements.map((candidate) => {
            if (candidate.id !== elementId) return candidate
            if (candidate.kind === 'hero') {
              return { ...candidate, ctaLink: nextLink }
            }
            if (candidate.kind === 'text' || candidate.kind === 'button') {
              return { ...candidate, link: nextLink }
            }
            return candidate
          }),
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
