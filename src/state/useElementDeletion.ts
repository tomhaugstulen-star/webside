import { useCallback } from 'react'
import { useEditorProject } from './useEditorProject'

export function useElementDeletion() {
  const { activePage, dispatch } = useEditorProject()

  const deleteElement = useCallback(
    (elementId: string) => {
      const element = activePage.elements.find(
        (candidate) => candidate.id === elementId,
      )

      if (!element || element.locked) return

      dispatch({
        type: 'delete-element-from-active-page',
        elementId,
        updatedAt: new Date().toISOString(),
      })

    },
    [activePage.elements, dispatch],
  )

  return { deleteElement }
}
