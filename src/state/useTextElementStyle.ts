import { useCallback } from 'react'
import type { TextElementStylePatch } from '../model/textElementStyle'
import { useEditorProject } from './useEditorProject'

export function useTextElementStyle() {
  const { dispatch } = useEditorProject()

  const updateTextElementStyle = useCallback(
    (elementId: string, patch: TextElementStylePatch) => {
      dispatch({
        type: 'set-text-element-style',
        elementId,
        patch,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { updateTextElementStyle }
}
