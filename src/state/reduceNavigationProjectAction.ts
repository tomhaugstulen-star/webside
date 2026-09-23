import type { EditorProjectState } from '../model/editorProject'
import {
  isValidNavigationLabel,
  isValidNavigationTarget,
  navigationTargetExists,
  type NavigationTarget,
} from '../model/navigation'
import type { NavigationProjectAction } from './navigationProjectAction'

function isStableId(value: string) {
  return value.length > 0 && value.trim() === value
}

function copyNavigationTarget(target: NavigationTarget): NavigationTarget {
  return target.type === 'page'
    ? { type: 'page', pageId: target.pageId }
    : {
        type: 'section',
        pageId: target.pageId,
        elementId: target.elementId,
      }
}

function navigationTargetsEqual(
  first: NavigationTarget,
  second: NavigationTarget,
) {
  if (first.type !== second.type || first.pageId !== second.pageId) {
    return false
  }

  return (
    first.type === 'page' ||
    (second.type === 'section' && first.elementId === second.elementId)
  )
}

function updateNavigation(
  state: EditorProjectState,
  items: EditorProjectState['project']['navigation']['items'],
  updatedAt: string,
): EditorProjectState {
  return {
    ...state,
    project: {
      ...state.project,
      navigation: { items },
      updatedAt,
    },
  }
}

export function reduceNavigationProjectAction(
  state: EditorProjectState,
  action: NavigationProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'add-navigation-item': {
      if (
        !isStableId(action.itemId) ||
        state.project.navigation.items.some((item) => item.id === action.itemId) ||
        !isValidNavigationLabel(action.label) ||
        !isValidNavigationTarget(action.target) ||
        (action.parentId !== undefined && !state.project.navigation.items.some(
          (item) => item.id === action.parentId && !item.parentId,
        )) ||
        !navigationTargetExists(state.project.pages, action.target)
      ) {
        return state
      }

      return updateNavigation(
        state,
        [
          ...state.project.navigation.items,
          {
            id: action.itemId,
            label: action.label,
            target: copyNavigationTarget(action.target),
            ...(action.parentId ? { parentId: action.parentId } : {}),
          },
        ],
        action.updatedAt,
      )
    }

    case 'set-navigation-item-label': {
      const item = state.project.navigation.items.find(
        (candidate) => candidate.id === action.itemId,
      )

      if (
        !item ||
        !isValidNavigationLabel(action.label) ||
        item.label === action.label
      ) {
        return state
      }

      return updateNavigation(
        state,
        state.project.navigation.items.map((candidate) =>
          candidate.id === action.itemId
            ? { ...candidate, label: action.label }
            : candidate,
        ),
        action.updatedAt,
      )
    }

    case 'set-navigation-item-target': {
      const item = state.project.navigation.items.find(
        (candidate) => candidate.id === action.itemId,
      )

      if (
        !item ||
        !isValidNavigationTarget(action.target) ||
        !navigationTargetExists(state.project.pages, action.target) ||
        navigationTargetsEqual(item.target, action.target)
      ) {
        return state
      }

      return updateNavigation(
        state,
        state.project.navigation.items.map((candidate) =>
          candidate.id === action.itemId
            ? { ...candidate, target: copyNavigationTarget(action.target) }
            : candidate,
        ),
        action.updatedAt,
      )
    }

    case 'move-navigation-item': {
      if (action.direction !== 'up' && action.direction !== 'down') {
        return state
      }

      const index = state.project.navigation.items.findIndex(
        (item) => item.id === action.itemId,
      )
      const siblings = state.project.navigation.items
        .map((item, itemIndex) => item.parentId ===
          state.project.navigation.items[index]?.parentId ? itemIndex : -1)
        .filter((itemIndex) => itemIndex >= 0)
      const siblingIndex = siblings.indexOf(index)
      const targetIndex = siblings[siblingIndex + (action.direction === 'up' ? -1 : 1)]

      if (
        index < 0 ||
        targetIndex === undefined
      ) {
        return state
      }

      const items = [...state.project.navigation.items]
      const movingItem = items[index]
      items[index] = items[targetIndex]
      items[targetIndex] = movingItem

      return updateNavigation(state, items, action.updatedAt)
    }

    case 'set-navigation-item-parent': {
      const item = state.project.navigation.items.find(
        (candidate) => candidate.id === action.itemId,
      )
      if (!item || item.parentId === (action.parentId ?? undefined) ||
        (action.parentId !== null && !state.project.navigation.items.some(
          (parent) => parent.id === action.parentId && parent.id !== action.itemId && !parent.parentId,
        )) ||
        (action.parentId !== null && state.project.navigation.items.some(
          (child) => child.parentId === action.itemId,
        ))) return state

      return updateNavigation(state, state.project.navigation.items.map((candidate) => {
        if (candidate.id !== action.itemId) return candidate
        const { parentId: _previous, ...rest } = candidate
        void _previous
        return action.parentId ? { ...rest, parentId: action.parentId } : rest
      }), action.updatedAt)
    }

    case 'delete-navigation-item': {
      const items = state.project.navigation.items.flatMap((item) => {
        if (item.id === action.itemId) return []
        if (item.parentId !== action.itemId) return [item]
        const { parentId: _previous, ...rest } = item
        void _previous
        return [rest]
      })

      if (items.length === state.project.navigation.items.length) {
        return state
      }

      return updateNavigation(state, items, action.updatedAt)
    }
  }

  const unhandledAction: never = action
  return unhandledAction
}
