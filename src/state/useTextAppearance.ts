import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import type { ElementFrameWidth } from '../model/elementFrame'
import { useEditorProject } from './useEditorProject'

export function useTextAppearance() {
  const { dispatch } = useEditorProject()

  const updateTextBackgroundColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false

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

  const updateTextFrameWidth = useCallback(
    (elementId: string, width: ElementFrameWidth) => {
      dispatch({
        type: 'set-text-frame-width',
        elementId,
        width,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateTextFrameColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false

      dispatch({
        type: 'set-text-frame-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  return {
    updateTextBackgroundColor,
    updateTextFrameWidth,
    updateTextFrameColor,
  }
}
