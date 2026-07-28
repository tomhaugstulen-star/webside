import { useCallback } from 'react'
import { useEditorProject } from './useEditorProject'

export function useElementLocking() {
  const { dispatch } = useEditorProject()

  const toggleElementLocked = useCallback(
    (elementId: string) => {
      dispatch({
        type: 'toggle-element-lock',
        elementId,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { toggleElementLocked }
}
