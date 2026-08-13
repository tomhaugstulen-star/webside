import { createEditorPage } from '../model/createEditorProject'
import type { EditorProjectState } from '../model/editorProject'
import { pruneDanglingNavigationItems } from '../model/navigation'
import { isValidPageName, isValidPageSlug } from '../model/siteStructure'
import type { PageProjectAction } from './pageProjectAction'

function isStableId(value: string) {
  return value.length > 0 && value.trim() === value
}

function pageSlugExists(
  state: EditorProjectState,
  slug: string,
  excludedPageId?: string,
) {
  return state.project.pages.some(
    (page) => page.id !== excludedPageId && page.slug === slug,
  )
}

function updatePages(
  state: EditorProjectState,
  pages: EditorProjectState['project']['pages'],
  updatedAt: string,
): EditorProjectState {
  return {
    ...state,
    project: {
      ...state.project,
      pages,
      updatedAt,
    },
  }
}

export function reducePageProjectAction(
  state: EditorProjectState,
  action: PageProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'add-page': {
      if (
        !isStableId(action.pageId) ||
        state.project.pages.some((page) => page.id === action.pageId) ||
        !isValidPageName(action.name) ||
        !isValidPageSlug(action.slug) ||
        pageSlugExists(state, action.slug)
      ) {
        return state
      }

      const page = createEditorPage(action.pageId, action.name, action.slug)

      return {
        ...state,
        project: {
          ...state.project,
          pages: [...state.project.pages, page],
          updatedAt: action.updatedAt,
        },
        activePageId: page.id,
        selectedElementId: null,
      }
    }

    case 'set-page-name': {
      const page = state.project.pages.find(
        (candidate) => candidate.id === action.pageId,
      )

      if (!page || !isValidPageName(action.name) || page.name === action.name) {
        return state
      }

      return updatePages(
        state,
        state.project.pages.map((candidate) =>
          candidate.id === action.pageId
            ? { ...candidate, name: action.name }
            : candidate,
        ),
        action.updatedAt,
      )
    }

    case 'set-page-slug': {
      const page = state.project.pages.find(
        (candidate) => candidate.id === action.pageId,
      )

      if (
        !page ||
        !isValidPageSlug(action.slug) ||
        page.slug === action.slug ||
        pageSlugExists(state, action.slug, action.pageId)
      ) {
        return state
      }

      return updatePages(
        state,
        state.project.pages.map((candidate) =>
          candidate.id === action.pageId
            ? { ...candidate, slug: action.slug }
            : candidate,
        ),
        action.updatedAt,
      )
    }

    case 'move-page': {
      if (action.direction !== 'up' && action.direction !== 'down') {
        return state
      }

      const index = state.project.pages.findIndex(
        (page) => page.id === action.pageId,
      )
      const targetIndex = action.direction === 'up' ? index - 1 : index + 1

      if (
        index < 0 ||
        targetIndex < 0 ||
        targetIndex >= state.project.pages.length
      ) {
        return state
      }

      const pages = [...state.project.pages]
      const movingPage = pages[index]
      pages[index] = pages[targetIndex]
      pages[targetIndex] = movingPage

      return updatePages(state, pages, action.updatedAt)
    }

    case 'delete-page': {
      const index = state.project.pages.findIndex(
        (page) => page.id === action.pageId,
      )

      if (index < 0 || state.project.pages.length <= 1) {
        return state
      }

      const pages = state.project.pages.filter(
        (page) => page.id !== action.pageId,
      )
      const navigation = pruneDanglingNavigationItems(
        state.project.navigation,
        pages,
      )
      const activePageDeleted = state.activePageId === action.pageId
      const activePageId = activePageDeleted
        ? pages[Math.min(index, pages.length - 1)].id
        : state.activePageId

      return {
        ...state,
        project: {
          ...state.project,
          pages,
          navigation,
          updatedAt: action.updatedAt,
        },
        activePageId,
        selectedElementId: activePageDeleted ? null : state.selectedElementId,
      }
    }
  }

  const unhandledAction: never = action
  return unhandledAction
}
