import type { NavigationTarget } from '../model/navigation'

export type NavigationProjectAction =
  | {
      type: 'add-navigation-item'
      itemId: string
      label: string
      target: NavigationTarget
      updatedAt: string
    }
  | {
      type: 'set-navigation-item-label'
      itemId: string
      label: string
      updatedAt: string
    }
  | {
      type: 'set-navigation-item-target'
      itemId: string
      target: NavigationTarget
      updatedAt: string
    }
  | {
      type: 'move-navigation-item'
      itemId: string
      direction: 'up' | 'down'
      updatedAt: string
    }
  | {
      type: 'delete-navigation-item'
      itemId: string
      updatedAt: string
    }
