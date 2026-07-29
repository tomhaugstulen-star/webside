import { findButtonAsset } from '../assets/buttons/buttonAssetCatalog'
import { createEditorElement } from '../model/createEditorElement'
import type { ElementCreationRequest } from '../model/elementCreation'
import type { EditorProjectState } from '../model/editorProject'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'

function projectContainsElement(state: EditorProjectState, elementId: string) {
  return state.project.pages.some((page) =>
    page.elements.some((element) => element.id === elementId),
  )
}

function requestIsValid(request: ElementCreationRequest) {
  switch (request.kind) {
    case 'section':
    case 'text':
      return true
    case 'image':
      return (
        isImageAssetId(request.assetId) &&
        isValidImageAssetMetadata(request.assetMetadata)
      )
    case 'button':
      return findButtonAsset(request.assetId) !== null
  }

  const unhandledRequest: never = request
  return unhandledRequest
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
    !requestIsValid(request)
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
