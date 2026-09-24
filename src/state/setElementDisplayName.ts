import type { EditorProjectState } from '../model/editorProject'

export function setElementDisplayName(
  state: EditorProjectState,
  elementId: string,
  displayName: string,
  updatedAt: string,
): EditorProjectState {
  const page = state.project.pages.find((item) => item.id === state.activePageId)
  const element = page?.elements.find((item) => item.id === elementId)
  if (!page || !element) return state

  const normalized = displayName.trim().slice(0, 60)
  if ((element.displayName ?? '') === normalized) return state

  return {
    ...state,
    project: {
      ...state.project,
      updatedAt,
      pages: state.project.pages.map((item) => item.id === page.id ? {
        ...item,
        elements: item.elements.map((candidate) => candidate.id === element.id ? {
          ...candidate,
          ...(normalized ? { displayName: normalized } : {}),
        } : candidate),
      } : item),
    },
  }
}
