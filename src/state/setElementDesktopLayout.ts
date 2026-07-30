import {
  elementLayoutsEqual,
  getElementDesktopLayout,
  isValidElementDesktopLayout,
  type ElementLayout,
} from '../model/elementLayout'
import type { EditorElement, EditorProjectState } from '../model/editorProject'

function getPersistedLayout(
  element: EditorElement,
  layout: ElementLayout,
): ElementLayout {
  if (element.kind !== 'header' || element.widthMode !== 'full') {
    return layout
  }

  return {
    position: {
      x: element.position.desktop.x,
      y: layout.position.y,
    },
    size: {
      width: element.size.desktop.width,
      height: layout.size.height,
    },
  }
}

export function setElementDesktopLayout(
  state: EditorProjectState,
  elementId: string,
  layout: ElementLayout,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (
    !activePage ||
    !element ||
    element.locked ||
    !isValidElementDesktopLayout(element, layout)
  ) {
    return state
  }

  const persistedLayout = getPersistedLayout(element, layout)

  if (elementLayoutsEqual(getElementDesktopLayout(element), persistedLayout)) {
    return state
  }

  return {
    ...state,
    project: {
      ...state.project,
      pages: state.project.pages.map((page) =>
        page.id === state.activePageId
          ? {
              ...page,
              elements: page.elements.map((candidate) =>
                candidate.id === elementId
                  ? {
                      ...candidate,
                      position: {
                        ...candidate.position,
                        desktop: { ...persistedLayout.position },
                      },
                      size: {
                        ...candidate.size,
                        desktop: { ...persistedLayout.size },
                      },
                    }
                  : candidate,
              ),
            }
          : page,
      ),
      updatedAt,
    },
  }
}
