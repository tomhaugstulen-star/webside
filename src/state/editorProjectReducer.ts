import { createInitialEditorProjectState } from '../model/createEditorProject'
import type { EditorProjectState } from '../model/editorProject'
import { isValidProjectSiteStructure } from '../model/siteStructure'
import { reduceSiteMetadata } from './reduceSiteMetadata'
import { addElementToActivePage } from './addElementToActivePage'
import { deleteElementFromActivePage } from './deleteElementFromActivePage'
import { insertElementsToActivePage } from './insertElementsToActivePage'
import type { EditorProjectAction } from './editorProjectAction'
import { reduceColorProjectAction } from './reduceColorProjectAction'
import { reduceHeaderAppearanceAction } from './reduceHeaderAppearanceAction'
import { reduceHeaderProjectAction } from './reduceHeaderProjectAction'
import { reduceHeroProjectAction } from './reduceHeroProjectAction'
import { reduceImageProjectAction } from './reduceImageProjectAction'
import { reduceNavigationProjectAction } from './reduceNavigationProjectAction'
import { reducePageProjectAction } from './reducePageProjectAction'
import { resetElementMobileOverrides, setElementMobileVisibility } from './reduceResponsiveElementAction'
import { setButtonAsset } from './setButtonAsset'
import { setButtonDropdown } from './setButtonDropdown'
import { setButtonLabel } from './setButtonLabel'
import { setElementDesktopLayout } from './setElementDesktopLayout'
import { setElementViewportLayout } from './setElementViewportLayout'
import { setElementLink } from './setElementLink'
import { setSectionAnchorId } from './setSectionAnchorId'
import { setTextElementContent } from './setTextElementContent'
import { setTextElementStyle } from './setTextElementStyle'
import { toggleElementLock } from './toggleElementLock'
export function getInitialEditorProjectState() {
  return createInitialEditorProjectState()
}
function activePageContainsElement(state: EditorProjectState, elementId: string) {
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )
  return activePage?.elements.some((element) => element.id === elementId) ?? false
}
function selectedElementExists(state: EditorProjectState) {
  return (
    state.selectedElementId === null ||
    activePageContainsElement(state, state.selectedElementId)
  )
}

function ensureValidSelection(state: EditorProjectState): EditorProjectState {
  if (selectedElementExists(state)) return state
  return { ...state, selectedElementId: null }
}

function reduceEditorProjectState(
  state: EditorProjectState,
  action: EditorProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'set-site-metadata':
      return reduceSiteMetadata(state, action)
    case 'replace-project': {
      const activePageId = action.project.pages[0]?.id
      if (!activePageId) {
        throw new Error('An editor project must contain at least one page.')
      }
      if (!isValidProjectSiteStructure(action.project)) return state
      return {
        project: action.project,
        activePageId,
        selectedElementId: null,
      }
    }

    case 'set-active-page': {
      if (action.pageId === state.activePageId) return state
      const pageExists = state.project.pages.some(
        (page) => page.id === action.pageId,
      )
      if (!pageExists) return state
      return {
        ...state,
        activePageId: action.pageId,
        selectedElementId: null,
      }
    }

    case 'set-selected-element':
      if (action.elementId === state.selectedElementId) return state
      if (
        action.elementId !== null &&
        !activePageContainsElement(state, action.elementId)
      ) {
        return state
      }
      return { ...state, selectedElementId: action.elementId }

    case 'add-page':
    case 'set-page-name':
    case 'set-page-slug':
    case 'move-page':
    case 'delete-page':
      return reducePageProjectAction(state, action)

    case 'add-navigation-item':
    case 'set-navigation-item-label':
    case 'set-navigation-item-target':
    case 'set-navigation-item-parent':
    case 'move-navigation-item':
    case 'delete-navigation-item':
      return reduceNavigationProjectAction(state, action)

    case 'add-element-to-active-page':
      return addElementToActivePage(
        state,
        action.elementId,
        action.request,
        action.updatedAt,
      )

    case 'insert-elements-to-active-page':
      return insertElementsToActivePage(
        state, action.elements, action.selectedElementId, action.updatedAt,
      )

    case 'delete-element-from-active-page':
      return deleteElementFromActivePage(
        state, action.elementId, action.updatedAt,
      )

    case 'set-section-anchor-id':
      return setSectionAnchorId(
        state, action.elementId, action.anchorId, action.updatedAt,
      )

    case 'set-element-desktop-layout':
      return setElementDesktopLayout(
        state,
        action.elementId,
        action.layout,
        action.updatedAt,
      )

    case 'set-element-viewport-layout':
      return setElementViewportLayout(
        state,
        action.elementId,
        action.viewport,
        action.layout,
        action.updatedAt,
      )

    case 'toggle-element-lock':
      return toggleElementLock(state, action.elementId, action.updatedAt)

    case 'set-element-mobile-visibility':
      return setElementMobileVisibility(
        state,
        action.elementId,
        action.visible,
        action.updatedAt,
      )

    case 'reset-element-mobile-overrides':
      return resetElementMobileOverrides(
        state,
        action.elementId,
        action.updatedAt,
      )

    case 'set-text-element-content':
      return setTextElementContent(
        state,
        action.elementId,
        action.content,
        action.updatedAt,
      )

    case 'set-text-element-style':
      return setTextElementStyle(
        state,
        action.elementId,
        action.patch,
        action.updatedAt,
      )

    case 'set-element-link':
      return setElementLink(
        state,
        action.elementId,
        action.link,
        action.updatedAt,
      )

    case 'set-button-label':
      return setButtonLabel(
        state,
        action.elementId,
        action.label,
        action.updatedAt,
      )
    case 'set-button-asset':
      return setButtonAsset(
        state,
        action.elementId,
        action.assetId,
        action.updatedAt,
      )
    case 'set-button-dropdown':
      return setButtonDropdown(state, action.elementId, action.dropdown, action.updatedAt)
    case 'set-active-page-background-fill':
    case 'set-section-background-fill':
    case 'set-section-frame-width':
    case 'set-section-frame-color':
    case 'set-text-background-fill':
    case 'set-text-frame-width':
    case 'set-text-frame-color':
      return reduceColorProjectAction(state, action)

    case 'set-header-content':
    case 'set-header-logo':
      return reduceHeaderProjectAction(state, action)
    case 'set-header-background-fill':
    case 'set-header-text-color':
    case 'set-header-font-family':
    case 'set-header-font-size':
    case 'set-header-frame-width':
    case 'set-header-frame-color':
      return reduceHeaderAppearanceAction(state, action)

    case 'set-hero-content':
    case 'set-hero-image':
    case 'set-hero-background-fill':
    case 'set-hero-text-color':
    case 'set-hero-frame-width':
    case 'set-hero-frame-color':
      return reduceHeroProjectAction(state, action)

    case 'set-image-alt-text':
    case 'set-image-mode':
    case 'set-image-transform':
    case 'set-image-desktop-frame':
    case 'set-image-viewport-frame':
      return reduceImageProjectAction(state, action)
  }

  const unhandledAction: never = action
  return unhandledAction
}

export function editorProjectReducer(
  state: EditorProjectState,
  action: EditorProjectAction,
): EditorProjectState {
  return ensureValidSelection(reduceEditorProjectState(state, action))
}
