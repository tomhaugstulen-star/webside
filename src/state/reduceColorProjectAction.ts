import { isEditorColor } from '../model/editorColor'
import { isElementFrameWidth } from '../model/elementFrame'
import type {
  EditorProjectState,
  SectionEditorElement,
  TextEditorElement,
} from '../model/editorProject'
import { isValidPageAppearance } from '../model/pageAppearance'
import {
  isSectionFrameWidth,
  isValidSectionAppearance,
  type SectionAppearance,
} from '../model/sectionAppearance'
import {
  isValidTextAppearance,
  type TextAppearance,
} from '../model/textAppearance'
import type { ColorProjectAction } from './editorProjectAction'

type SectionAppearanceUpdater = (
  element: SectionEditorElement,
) => SectionAppearance | null

type TextAppearanceUpdater = (
  element: TextEditorElement,
) => TextAppearance | null

function updateActiveSectionAppearance(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
  updateAppearance: SectionAppearanceUpdater,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (!activePage || !element || element.kind !== 'section' || element.locked) {
    return state
  }

  const nextAppearance = updateAppearance(element)

  if (!nextAppearance || !isValidSectionAppearance(nextAppearance)) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'section'
              ? { ...candidate, appearance: nextAppearance }
              : candidate,
          ),
        }
      : page,
  )

  return {
    ...state,
    project: { ...state.project, pages, updatedAt },
  }
}

function updateActiveTextAppearance(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
  updateAppearance: TextAppearanceUpdater,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (!activePage || !element || element.kind !== 'text' || element.locked) {
    return state
  }

  const nextAppearance = updateAppearance(element)

  if (!nextAppearance || !isValidTextAppearance(nextAppearance)) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'text'
              ? { ...candidate, appearance: nextAppearance }
              : candidate,
          ),
        }
      : page,
  )

  return {
    ...state,
    project: { ...state.project, pages, updatedAt },
  }
}

export function reduceColorProjectAction(
  state: EditorProjectState,
  action: ColorProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'set-active-page-background-color': {
      if (!isEditorColor(action.color)) return state

      const activePage = state.project.pages.find(
        (page) => page.id === state.activePageId,
      )

      if (!activePage || activePage.appearance.backgroundColor === action.color) {
        return state
      }

      const nextAppearance = { backgroundColor: action.color }
      if (!isValidPageAppearance(nextAppearance)) return state

      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map((page) =>
            page.id === state.activePageId
              ? { ...page, appearance: nextAppearance }
              : page,
          ),
          updatedAt: action.updatedAt,
        },
      }
    }

    case 'set-section-background-color':
      if (!isEditorColor(action.color)) return state
      return updateActiveSectionAppearance(
        state,
        action.elementId,
        action.updatedAt,
        (element) =>
          element.appearance.backgroundColor === action.color
            ? null
            : { ...element.appearance, backgroundColor: action.color },
      )

    case 'set-section-frame-width':
      if (!isSectionFrameWidth(action.width)) return state
      return updateActiveSectionAppearance(
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

    case 'set-section-frame-color':
      if (!isEditorColor(action.color)) return state
      return updateActiveSectionAppearance(
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

    case 'set-text-background-color':
      if (!isEditorColor(action.color)) return state
      return updateActiveTextAppearance(
        state,
        action.elementId,
        action.updatedAt,
        (element) =>
          element.appearance.backgroundColor === action.color
            ? null
            : { ...element.appearance, backgroundColor: action.color },
      )

    case 'set-text-frame-width':
      if (!isElementFrameWidth(action.width)) return state
      return updateActiveTextAppearance(
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

    case 'set-text-frame-color':
      if (!isEditorColor(action.color)) return state
      return updateActiveTextAppearance(
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
