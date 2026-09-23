import type { EditorElement, EditorProjectState } from '../model/editorProject'
import { isValidEditorProject } from '../model/editorProjectValidation'

export function insertElementsToActivePage(
  state: EditorProjectState,
  elements: readonly EditorElement[],
  selectedElementId: string,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )

  if (
    !activePage ||
    elements.length === 0 ||
    !elements.some((element) => element.id === selectedElementId)
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? { ...page, elements: [...page.elements, ...elements] }
      : page,
  )
  const project = {
    ...state.project,
    pages,
    updatedAt,
  }

  if (!isValidEditorProject(project)) return state

  return {
    ...state,
    project,
    selectedElementId,
  }
}
