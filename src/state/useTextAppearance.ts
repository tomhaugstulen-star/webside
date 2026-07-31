import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { useEditorProject } from './useEditorProject'

export function useTextAppearance() {
  const { dispatch } = useEditorProject()

  const updateTextBackgroundColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      dispatch({
        type: 'set-text-background-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  return { updateTextBackgroundColor }
}
