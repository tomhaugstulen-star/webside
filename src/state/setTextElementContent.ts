import type { EditorProjectState } from '../model/editorProject'

function normalizeTextContent(content: string) {
  return content.replace(/\r\n?/g, '\n')
}

export function setTextElementContent(
  state: EditorProjectState,
  elementId: string,
  content: string,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)
  const normalizedContent = normalizeTextContent(content)

  if (
    !activePage ||
    !element ||
    element.kind !== 'text' ||
    element.locked ||
    element.content === normalizedContent
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'text'
              ? { ...candidate, content: normalizedContent }
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
