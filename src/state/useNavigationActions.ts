import { useCallback } from 'react'
import { createStableId } from '../model/createStableId'
import type { NavigationTarget } from '../model/navigation'
import { useEditorProject } from './useEditorProject'

export function useNavigationActions() {
  const { dispatch } = useEditorProject()

  const addNavigationItem = useCallback(
    (label: string, target: NavigationTarget) => {
      dispatch({
        type: 'add-navigation-item',
        itemId: createStableId(),
        label,
        target,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const setNavigationItemLabel = useCallback(
    (itemId: string, label: string) => {
      dispatch({
        type: 'set-navigation-item-label',
        itemId,
        label,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const setNavigationItemTarget = useCallback(
    (itemId: string, target: NavigationTarget) => {
      dispatch({
        type: 'set-navigation-item-target',
        itemId,
        target,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const moveNavigationItem = useCallback(
    (itemId: string, direction: 'up' | 'down') => {
      dispatch({
        type: 'move-navigation-item',
        itemId,
        direction,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const deleteNavigationItem = useCallback(
    (itemId: string) => {
      dispatch({
        type: 'delete-navigation-item',
        itemId,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return {
    addNavigationItem,
    setNavigationItemLabel,
    setNavigationItemTarget,
    moveNavigationItem,
    deleteNavigationItem,
  }
}
