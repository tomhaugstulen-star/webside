import type { EditorProjectState } from '../model/editorProject'
import {
  isHeaderWidthMode,
  type HeaderWidthMode,
} from '../model/headerWidth'

export function setHeaderWidthMode(
  state: EditorProjectState,
  elementId: string,
  widthMode: HeaderWidthMode,
  updatedAt: string,
): EditorProjectState {
  if (!isHeaderWidthMode(widthMode)) {
    return state
  }

  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (
    !activePage ||
    !element ||
    element.kind !== 'header' ||
    element.locked ||
    element.widthMode === widthMode
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
                candidate.id === elementId && candidate.kind === 'header'
                  ? { ...candidate, widthMode }
                  : candidate,
              ),
            }
          : page,
      ),
      updatedAt,
    },
  }
}
