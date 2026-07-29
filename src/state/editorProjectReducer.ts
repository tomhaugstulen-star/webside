import { findButtonAsset } from '../assets/buttons/buttonAssetCatalog'
import { createEditorElement } from '../model/createEditorElement'
import {
  elementLayoutsEqual,
  getElementDesktopLayout,
  isValidElementLayout,
} from '../model/elementLayout'
import { createInitialEditorProjectState } from '../model/createEditorProject'
import type { EditorProjectState } from '../model/editorProject'
import type { EditorProjectAction } from './editorProjectAction'
import { deleteElementFromActivePage } from './deleteElementFromActivePage'
import { setButtonAsset } from './setButtonAsset'
import { setButtonLabel } from './setButtonLabel'
import { setElementLink } from './setElementLink'
import { setTextElementContent } from './setTextElementContent'
import { setTextElementStyle } from './setTextElementStyle'
import { toggleElementLock } from './toggleElementLock'

export function getInitialEditorProjectState() {
  return createInitialEditorProjectState()
}

function activePageContainsElement(state: EditorProjectState, elementId: string) {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  return activePage?.elements.some((element) => element.id === elementId) ?? false
}

function projectContainsElement(state: EditorProjectState, elementId: string) {
  return state.project.pages.some((page) =>
    page.elements.some((element) => element.id === elementId),
  )
}

function selectedElementExists(state: EditorProjectState) {
  return (
    state.selectedElementId === null ||
    activePageContainsElement(state, state.selectedElementId)
  )
}

function ensureValidSelection(state: EditorProjectState): EditorProjectState {
  if (selectedElementExists(state)) {
    return state
  }

  return {
    ...state,
    selectedElementId: null,
  }
}

function reduceEditorProjectState(
  state: EditorProjectState,
  action: EditorProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'replace-project': {
      const activePageId = action.project.pages[0]?.id

      if (!activePageId) {
        throw new Error('An editor project must contain at least one page.')
      }

      return {
        project: action.project,
        activePageId,
        selectedElementId: null,
      }
    }

    case 'set-active-page': {
      if (action.pageId === state.activePageId) {
        return state
      }

      const pageExists = state.project.pages.some((page) => page.id === action.pageId)

      if (!pageExists) {
        return state
      }

      return {
        ...state,
        activePageId: action.pageId,
        selectedElementId: null,
      }
    }

    case 'set-selected-element': {
      if (action.elementId === state.selectedElementId) {
        return state
      }

      if (
        action.elementId !== null &&
        !activePageContainsElement(state, action.elementId)
      ) {
        return state
      }

      return {
        ...state,
        selectedElementId: action.elementId,
      }
    }

    case 'add-element-to-active-page': {
      const activePage = state.project.pages.find((page) => page.id === state.activePageId)

      if (
        !activePage ||
        projectContainsElement(state, action.elementId) ||
        (action.request.kind === 'button' &&
          findButtonAsset(action.request.assetId) === null)
      ) {
        return state
      }

      const element = createEditorElement({
        id: action.elementId,
        request: action.request,
        existingElements: activePage.elements,
      })
      const pages = state.project.pages.map((page) =>
        page.id === state.activePageId
          ? { ...page, elements: [...page.elements, element] }
          : page,
      )

      return {
        ...state,
        project: {
          ...state.project,
          pages,
          updatedAt: action.updatedAt,
        },
        selectedElementId: element.id,
      }
    }

    case 'delete-element-from-active-page':
      return deleteElementFromActivePage(
        state,
        action.elementId,
        action.updatedAt,
      )

    case 'set-element-desktop-layout': {
      const activePage = state.project.pages.find((page) => page.id === state.activePageId)
      const element = activePage?.elements.find((candidate) => candidate.id === action.elementId)

      if (
        !activePage ||
        !element ||
        element.locked ||
        !isValidElementLayout(element.kind, action.layout) ||
        elementLayoutsEqual(getElementDesktopLayout(element), action.layout)
      ) {
        return state
      }

      const pages = state.project.pages.map((page) =>
        page.id === state.activePageId
          ? {
              ...page,
              elements: page.elements.map((candidate) =>
                candidate.id === action.elementId
                  ? {
                      ...candidate,
                      position: {
                        ...candidate.position,
                        desktop: { ...action.layout.position },
                      },
                      size: {
                        ...candidate.size,
                        desktop: { ...action.layout.size },
                      },
                    }
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
          updatedAt: action.updatedAt,
        },
      }
    }

    case 'toggle-element-lock':
      return toggleElementLock(state, action.elementId, action.updatedAt)

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
