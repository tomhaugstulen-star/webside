import { isEditorColor } from '../model/editorColor'
import { editorFillsEqual, isEditorFill } from '../model/editorFill'
import { isElementFrameWidth } from '../model/elementFrame'
import type {
  EditorProjectState,
  HeroEditorElement,
} from '../model/editorProject'
import { isValidHeroAppearance } from '../model/heroAppearance'
import {
  isValidHeroCtaLabel,
  isValidHeroSubtitle,
  isValidHeroTitle,
  normalizeHeroText,
} from '../model/heroElement'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'
import type { HeroProjectAction } from './heroProjectAction'

type HeroUpdater = (
  element: HeroEditorElement,
) => HeroEditorElement | null

function updateActiveHero(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
  update: HeroUpdater,
): EditorProjectState {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  const element = activePage?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (!activePage || !element || element.kind !== 'hero' || element.locked) {
    return state
  }

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

export function reduceHeroProjectAction(
  state: EditorProjectState,
  action: HeroProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'set-hero-content':
      return updateActiveHero(
        state,
        action.elementId,
        action.updatedAt,
        (element) => {
          const title = normalizeHeroText(action.title)
          const subtitle = normalizeHeroText(action.subtitle)
          const ctaLabel = normalizeHeroText(action.ctaLabel)

          if (
            !isValidHeroTitle(title) ||
            !isValidHeroSubtitle(subtitle) ||
            !isValidHeroCtaLabel(ctaLabel) ||
            (title === element.title &&
              subtitle === element.subtitle &&
              ctaLabel === element.ctaLabel)
          ) {
            return null
          }

          return { ...element, title, subtitle, ctaLabel }
        },
      )

    case 'set-hero-image':
      if (
        !isImageAssetId(action.imageAssetId) ||
        !isValidImageAssetMetadata(action.imageAssetMetadata)
      ) {
        return state
      }
      return updateActiveHero(
        state,
        action.elementId,
        action.updatedAt,
        (element) =>
          element.imageAssetId === action.imageAssetId
            ? null
            : {
                ...element,
                imageAssetId: action.imageAssetId,
                imageAssetMetadata: { ...action.imageAssetMetadata },
              },
      )

    case 'set-hero-background-fill':
      if (!isEditorFill(action.fill)) return state
      return updateActiveHero(
        state,
        action.elementId,
        action.updatedAt,
        (element) => {
          if (editorFillsEqual(element.appearance.backgroundFill, action.fill)) {
            return null
          }
          const appearance = {
            ...element.appearance,
            backgroundFill: action.fill,
          }
          return isValidHeroAppearance(appearance)
            ? { ...element, appearance }
            : null
        },
      )

    case 'set-hero-text-color':
      if (!isEditorColor(action.color)) return state
      return updateActiveHero(
        state,
        action.elementId,
        action.updatedAt,
        (element) => {
          if (element.appearance.textColor === action.color) return null
          const appearance = { ...element.appearance, textColor: action.color }
          return isValidHeroAppearance(appearance)
            ? { ...element, appearance }
            : null
        },
      )

    case 'set-hero-frame-width':
      if (!isElementFrameWidth(action.width)) return state
      return updateActiveHero(
        state,
        action.elementId,
        action.updatedAt,
        (element) => {
          if (element.appearance.frame.width === action.width) return null
          const appearance = {
            ...element.appearance,
            frame: { ...element.appearance.frame, width: action.width },
          }
          return isValidHeroAppearance(appearance)
            ? { ...element, appearance }
            : null
        },
      )

    case 'set-hero-frame-color':
      if (!isEditorColor(action.color)) return state
      return updateActiveHero(
        state,
        action.elementId,
        action.updatedAt,
        (element) => {
          if (element.appearance.frame.color === action.color) return null
          const appearance = {
            ...element.appearance,
            frame: { ...element.appearance.frame, color: action.color },
          }
          return isValidHeroAppearance(appearance)
            ? { ...element, appearance }
            : null
        },
      )
  }

  const unhandledAction: never = action
  return unhandledAction
}
