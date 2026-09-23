import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { createSolidFill, isEditorFill, type EditorFill } from '../model/editorFill'
import type { ElementFrameWidth } from '../model/elementFrame'
import type { TextFontFamily, TextFontSize } from '../model/textElementStyle'
import { useEditorProject } from './useEditorProject'

export function useHeaderAppearance() {
  const { dispatch } = useEditorProject()

  const updateHeaderBackgroundFill = useCallback(
    (elementId: string, fill: EditorFill) => {
      if (!isEditorFill(fill)) return false
      dispatch({
        type: 'set-header-background-fill',
        elementId,
        fill,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateHeaderBackgroundColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      return color ? updateHeaderBackgroundFill(elementId, createSolidFill(color)) : false
    },
    [updateHeaderBackgroundFill],
  )

  const updateHeaderTextColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false
      dispatch({ type: 'set-header-text-color', elementId, color, updatedAt: new Date().toISOString() })
      return true
    },
    [dispatch],
  )

  const updateHeaderFontFamily = useCallback(
    (elementId: string, fontFamily: TextFontFamily) => {
      dispatch({ type: 'set-header-font-family', elementId, fontFamily, updatedAt: new Date().toISOString() })
    },
    [dispatch],
  )

  const updateHeaderFontSize = useCallback(
    (elementId: string, fontSize: TextFontSize) => {
      dispatch({ type: 'set-header-font-size', elementId, fontSize, updatedAt: new Date().toISOString() })
    },
    [dispatch],
  )

  const updateHeaderFrameWidth = useCallback(
    (elementId: string, width: ElementFrameWidth) => {
      dispatch({ type: 'set-header-frame-width', elementId, width, updatedAt: new Date().toISOString() })
    },
    [dispatch],
  )

  const updateHeaderFrameColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false
      dispatch({ type: 'set-header-frame-color', elementId, color, updatedAt: new Date().toISOString() })
      return true
    },
    [dispatch],
  )

  return {
    updateHeaderBackgroundFill,
    updateHeaderBackgroundColor,
    updateHeaderTextColor,
    updateHeaderFontFamily,
    updateHeaderFontSize,
    updateHeaderFrameWidth,
    updateHeaderFrameColor,
  }
}
