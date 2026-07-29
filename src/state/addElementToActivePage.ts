import { findButtonAsset } from '../assets/buttons/buttonAssetCatalog'
import { createEditorElement } from '../model/createEditorElement'
import type { ElementCreationRequest } from '../model/elementCreation'
import type { EditorProjectState } from '../model/editorProject'

function projectContainsElement(state: EditorProjectState, elementId: string) {
  return state.project.pages.some((page) =>
    page.elements.some((element) => element.id === elementId),
  )
}

export function addElementToActivePage(
  state: EditorProjectState,
  elementId: string,
  request: ElementCreationRequest,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )

  if (
    !activePage ||
    projectContainsElement(state, elementId) ||
    (request.kind === 'button' && findButtonAsset(request.assetId) === null)
  ) {
    return state
  }

  const element = createEditorElement({
    id: elementId,
    request,
    existingElements: activePage.elements,
  })
  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? { ...page, elements: [...page.elements, element] }
      : page,
  )

  return {
    ...state,
    project: {
      ...state.project,
      pages,
      updatedAt,
    },
    selectedElementId: element.id,
  }
}
