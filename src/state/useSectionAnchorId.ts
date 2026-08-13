import { useCallback } from 'react'
import { useEditorProject } from './useEditorProject'

export function useSectionAnchorId() {
  const { dispatch } = useEditorProject()

  const setSectionAnchorId = useCallback(
    (elementId: string, anchorId: string) => {
      dispatch({
        type: 'set-section-anchor-id',
        elementId,
        anchorId,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { setSectionAnchorId }
}
