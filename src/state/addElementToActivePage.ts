import { createEditorElement } from '../model/createEditorElement'
import type { ElementCreationRequest } from '../model/elementCreation'
import type { EditorProjectState } from '../model/editorProject'
import { findPositionInSection } from '../model/findElementCreationPosition'
import { isValidElementCreationRequest } from './isValidElementCreationRequest'

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
    !isValidElementCreationRequest(request)
  ) {
    return state
  }

  const created = createEditorElement({
    id: elementId,
    request,
    existingElements: activePage.elements,
  })
  const selectedSection = activePage.elements.find(
    (candidate) => candidate.id === state.selectedElementId && candidate.kind === 'section',
  )
  const sectionPosition =
    selectedSection?.kind === 'section' &&
    !selectedSection.locked &&
    request.kind !== 'section' &&
    request.kind !== 'header'
      ? findPositionInSection(
          selectedSection,
          created.size.desktop,
          activePage.elements,
        )
      : null
  const element = sectionPosition
    ? { ...created, position: { ...created.position, desktop: sectionPosition } }
    : created
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
