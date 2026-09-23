import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { createSolidFill, isEditorFill, type EditorFill } from '../model/editorFill'
import type { ElementFrameWidth } from '../model/elementFrame'
import { useEditorProject } from './useEditorProject'

export function useTextAppearance() {
  const { dispatch } = useEditorProject()

  const updateTextBackgroundFill = useCallback(
    (elementId: string, fill: EditorFill) => {
      if (!isEditorFill(fill)) return false
      dispatch({
        type: 'set-text-background-fill',
        elementId,
        fill,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateTextBackgroundColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      return color ? updateTextBackgroundFill(elementId, createSolidFill(color)) : false
    },
    [updateTextBackgroundFill],
  )

  const updateTextFrameWidth = useCallback(
    (elementId: string, width: ElementFrameWidth) => {
      dispatch({ type: 'set-text-frame-width', elementId, width, updatedAt: new Date().toISOString() })
    },
    [dispatch],
  )

  const updateTextFrameColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false
      dispatch({ type: 'set-text-frame-color', elementId, color, updatedAt: new Date().toISOString() })
      return true
    },
    [dispatch],
  )

  return {
    updateTextBackgroundFill,
    updateTextBackgroundColor,
    updateTextFrameWidth,
    updateTextFrameColor,
  }
}
