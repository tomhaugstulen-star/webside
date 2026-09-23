import type { EditorProjectState } from '../model/editorProject'
import { pruneDanglingNavigationItems } from '../model/navigation'
import { getSectionContents } from '../model/sectionContents'

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

  const contents = element.kind === 'section'
    ? getSectionContents(element, activePage.elements)
    : []
  if (contents.some((child) => child.locked)) return state
  const deletedIds = new Set([elementId, ...contents.map((child) => child.id)])

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.filter((candidate) => !deletedIds.has(candidate.id)),
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
      state.selectedElementId && deletedIds.has(state.selectedElementId)
        ? null
        : state.selectedElementId,
  }
}
