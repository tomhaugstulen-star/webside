import type { EditorProjectState } from '../model/editorProject'
import {
  isValidTextElementStylePatch,
  textElementStylesEqual,
  type TextElementStylePatch,
} from '../model/textElementStyle'

export function setTextElementStyle(
  state: EditorProjectState,
  elementId: string,
  patch: TextElementStylePatch,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)

  if (
    !activePage ||
    !element ||
    element.kind !== 'text' ||
    element.locked ||
    !isValidTextElementStylePatch(patch)
  ) {
    return state
  }

  const nextTextStyle = {
    ...element.textStyle,
    ...patch,
  }

  if (textElementStylesEqual(element.textStyle, nextTextStyle)) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'text'
              ? { ...candidate, textStyle: nextTextStyle }
              : candidate,
          ),
        }
      : page,
  )

  return {
    ...state,
    project: {
      ...state.project,
      pages,
      updatedAt,
    },
  }
}
