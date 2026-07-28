import { useCallback } from 'react'
import type { ElementLink } from '../model/elementLink'
import { useEditorProject } from './useEditorProject'

export function useTextElementLink() {
  const { dispatch } = useEditorProject()

  const updateTextElementLink = useCallback(
    (elementId: string, link: ElementLink) => {
      dispatch({
        type: 'set-text-element-link',
        elementId,
        link,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { updateTextElementLink }
}
