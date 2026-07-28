import { useCallback } from 'react'
import { useEditorProject } from './useEditorProject'

export function useTextElementContent() {
  const { dispatch } = useEditorProject()

  const commitTextElementContent = useCallback(
    (elementId: string, content: string) => {
      dispatch({
        type: 'set-text-element-content',
        elementId,
        content,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { commitTextElementContent }
}
