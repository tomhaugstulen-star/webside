import { HEADER_SERIALIZED_WIDTH } from '../model/elementDimensions'
import {
  elementLayoutsEqual,
  isValidElementDesktopLayout,
  type ElementLayout,
} from '../model/elementLayout'
import type {
  EditorElement,
  EditorProjectState,
  ResponsiveViewport,
} from '../model/editorProject'
import { setElementDesktopLayout } from './setElementDesktopLayout'

function getPersistedMobileLayout(
  element: EditorElement,
  layout: ElementLayout,
): ElementLayout {
  if (element.kind !== 'header') return layout

  return {
    position: { x: 0, y: 0 },
    size: {
      width: HEADER_SERIALIZED_WIDTH,
      height: layout.size.height,
    },
  }
}

export function setElementViewportLayout(
  state: EditorProjectState,
  elementId: string,
  viewport: ResponsiveViewport,
  layout: ElementLayout,
  updatedAt: string,
): EditorProjectState {
  if (viewport === 'desktop') {
    return setElementDesktopLayout(state, elementId, layout, updatedAt)
  }

  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (!activePage || !element || element.locked) return state

  const persistedLayout = getPersistedMobileLayout(element, layout)
  if (!isValidElementDesktopLayout(element, persistedLayout)) return state

  const currentMobileLayout =
    element.position.mobile && element.size.mobile
      ? {
          position: element.position.mobile,
          size: element.size.mobile,
        }
      : null

  if (
    currentMobileLayout &&
    elementLayoutsEqual(currentMobileLayout, persistedLayout)
  ) {
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
                        mobile: { ...persistedLayout.position },
                      },
                      size: {
                        ...candidate.size,
                        mobile: { ...persistedLayout.size },
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
