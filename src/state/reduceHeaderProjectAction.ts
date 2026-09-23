import type {
  EditorProjectState,
  HeaderEditorElement,
} from '../model/editorProject'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
  normalizeHeaderText,
} from '../model/headerElement'
import { isValidHeaderAppearance } from '../model/headerAppearance'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'
import type { HeaderProjectAction } from './headerProjectAction'

type HeaderUpdater = (
  element: HeaderEditorElement,
) => HeaderEditorElement | null

function updateActiveHeader(
  state: EditorProjectState,
  elementId: string,
  updatedAt: string,
  update: HeaderUpdater,
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

export function reduceHeaderProjectAction(
  state: EditorProjectState,
  action: HeaderProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'set-header-content':
      return updateActiveHeader(
        state,
        action.elementId,
        action.updatedAt,
        (element) => {
          const siteName = normalizeHeaderText(action.siteName)
          const subtitle = normalizeHeaderText(action.subtitle)

          if (
            !isValidHeaderSiteName(siteName) ||
            !isValidHeaderSubtitle(subtitle) ||
            (siteName === element.siteName && subtitle === element.subtitle)
          ) {
            return null
          }

          return { ...element, siteName, subtitle }
        },
      )

    case 'set-header-logo':
      if (
        !isImageAssetId(action.logoAssetId) ||
        !isValidImageAssetMetadata(action.logoAssetMetadata)
      ) {
        return state
      }

      return updateActiveHeader(
        state,
        action.elementId,
        action.updatedAt,
        (element) =>
          element.logoAssetId === action.logoAssetId
            ? null
            : {
                ...element,
                logoAssetId: action.logoAssetId,
                logoAssetMetadata: { ...action.logoAssetMetadata },
              },
      )

    case 'apply-header-ai-proposal': {
      const siteName = normalizeHeaderText(action.siteName)
      const subtitle = normalizeHeaderText(action.subtitle)

      if (
        !isValidHeaderSiteName(siteName) ||
        !isValidHeaderSubtitle(subtitle) ||
        !isValidHeaderAppearance(action.appearance)
      ) {
        return state
      }

      return updateActiveHeader(
        state,
        action.elementId,
        action.updatedAt,
        (element) => {
          const unchanged =
            siteName === element.siteName &&
            subtitle === element.subtitle &&
            JSON.stringify(action.appearance) === JSON.stringify(element.appearance)

          return unchanged
            ? null
            : {
                ...element,
                siteName,
                subtitle,
                appearance: action.appearance,
              }
        },
      )
    }
  }

  const unhandledAction: never = action
  return unhandledAction
}
