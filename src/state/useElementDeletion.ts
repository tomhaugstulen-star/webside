import { useCallback } from 'react'
import { useEditorProject } from './useEditorProject'

export function useElementDeletion() {
  const { dispatch } = useEditorProject()

  const deleteElement = useCallback(
    (elementId: string) => {
      dispatch({
        type: 'delete-element-from-active-page',
        elementId,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { deleteElement }
}
