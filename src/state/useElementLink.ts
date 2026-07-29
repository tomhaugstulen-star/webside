import { useCallback } from 'react'
import type { ElementLink } from '../model/elementLink'
import { useEditorProject } from './useEditorProject'

export function useElementLink() {
  const { dispatch } = useEditorProject()

  const updateElementLink = useCallback(
    (elementId: string, link: ElementLink) => {
      dispatch({
        type: 'set-element-link',
        elementId,
        link,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { updateElementLink }
}
