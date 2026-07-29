import { useEffect } from 'react'
import type { EditorElement } from '../../model/editorProject'
import { isElementDeletionShortcutTarget } from './isElementDeletionShortcutTarget'

type UseElementDeletionShortcutOptions = {
  element: EditorElement | null
  onRequestDeletion: (
    element: EditorElement,
    returnFocus: HTMLElement | null,
  ) => void
}

export function useElementDeletionShortcut({
  element,
  onRequestDeletion,
}: UseElementDeletionShortcutOptions) {
  useEffect(() => {
    const requestDeletionOnDelete = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key !== 'Delete' ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !element ||
        element.locked ||
        isElementDeletionShortcutTarget(event.target)
      ) {
        return
      }

      event.preventDefault()

      const returnFocus =
        document.activeElement instanceof HTMLElement ? document.activeElement : null

      onRequestDeletion(element, returnFocus)
    }

    window.addEventListener('keydown', requestDeletionOnDelete)
    return () => window.removeEventListener('keydown', requestDeletionOnDelete)
  }, [element, onRequestDeletion])
}
