import type { EditorProjectState } from '../model/editorProject'
import { pruneDanglingNavigationItems } from '../model/navigation'

export function deleteElementFromActivePage(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)

  if (!activePage || !element || element.locked) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.filter((candidate) => candidate.id !== elementId),
        }
      : page,
  )
  const navigation = pruneDanglingNavigationItems(
    state.project.navigation,
    pages,
  )

  return {
    ...state,
    project: {
      ...state.project,
      pages,
      navigation,
      updatedAt,
    },
    selectedElementId:
      state.selectedElementId === elementId ? null : state.selectedElementId,
  }
}
