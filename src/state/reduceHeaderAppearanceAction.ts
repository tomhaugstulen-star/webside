import { isEditorColor } from '../model/editorColor'
import { isElementFrameWidth } from '../model/elementFrame'
import type {
  EditorProjectState,
  HeaderEditorElement,
} from '../model/editorProject'
import {
  isValidHeaderAppearance,
  type HeaderAppearance,
} from '../model/headerAppearance'
import type { HeaderAppearanceAction } from './editorProjectAction'

type HeaderAppearanceUpdater = (
  element: HeaderEditorElement,
) => HeaderAppearance | null

function updateActiveHeaderAppearance(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
  updateAppearance: HeaderAppearanceUpdater,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (!activePage || !element || element.kind !== 'header' || element.locked) {
    return state
  }

  const nextAppearance = updateAppearance(element)

  if (!nextAppearance || !isValidHeaderAppearance(nextAppearance)) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'header'
              ? { ...candidate, appearance: nextAppearance }
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

export function reduceHeaderAppearanceAction(
  state: EditorProjectState,
  action: HeaderAppearanceAction,
): EditorProjectState {
  switch (action.type) {
    case 'set-header-text-color':
      if (!isEditorColor(action.color)) {
        return state
      }

      return updateActiveHeaderAppearance(
        state,
        action.elementId,
        action.updatedAt,
        (element) =>
          element.appearance.textColor === action.color
            ? null
            : { ...element.appearance, textColor: action.color },
      )

    case 'set-header-frame-width':
      if (!isElementFrameWidth(action.width)) {
        return state
      }

      return updateActiveHeaderAppearance(
        state,
        action.elementId,
        action.updatedAt,
        (element) =>
          element.appearance.frame.width === action.width
            ? null
            : {
                ...element.appearance,
                frame: { ...element.appearance.frame, width: action.width },
              },
      )

    case 'set-header-frame-color':
      if (!isEditorColor(action.color)) {
        return state
      }

      return updateActiveHeaderAppearance(
        state,
        action.elementId,
        action.updatedAt,
        (element) =>
          element.appearance.frame.color === action.color
            ? null
            : {
                ...element.appearance,
                frame: { ...element.appearance.frame, color: action.color },
              },
      )
  }

  const unhandledAction: never = action
  return unhandledAction
}
