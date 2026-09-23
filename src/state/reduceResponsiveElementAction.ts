import type {
  EditorElement,
  EditorProjectState,
} from '../model/editorProject'

type MobileElementUpdater = (
  element: EditorElement,
) => EditorElement | null

function updateActiveElementMobileState(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
  update: MobileElementUpdater,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (!activePage || !element) return state

  const nextElement = update(element)
  if (!nextElement) return state

  return {
    ...state,
    project: {
      ...state.project,
      pages: state.project.pages.map((page) =>
        page.id === state.activePageId
          ? {
              ...page,
              elements: page.elements.map((candidate) =>
                candidate.id === elementId ? nextElement : candidate,
              ),
            }
          : page,
      ),
      updatedAt,
    },
  }
}

export function setElementMobileVisibility(
  state: EditorProjectState,
  elementId: string,
  visible: boolean,
  updatedAt: string,
) {
  return updateActiveElementMobileState(
    state,
    elementId,
    updatedAt,
    (element) => {
      if (element.visibility.mobile === visible) return null

      return {
        ...element,
        visibility: {
          ...element.visibility,
          mobile: visible,
        },
      }
    },
  )
}

export function resetElementMobileOverrides(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
) {
  return updateActiveElementMobileState(
    state,
    elementId,
    updatedAt,
    (element) => {
      if (
        element.position.mobile === undefined &&
        element.size.mobile === undefined &&
        element.visibility.mobile === undefined
      ) {
        return null
      }

      return {
        ...element,
        position: { desktop: element.position.desktop },
        size: { desktop: element.size.desktop },
        visibility: { desktop: element.visibility.desktop },
      }
    },
  )
}
