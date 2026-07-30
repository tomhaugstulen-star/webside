import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import type { ElementFrameWidth } from '../model/elementFrame'
import type {
  TextFontFamily,
  TextFontSize,
} from '../model/textElementStyle'
import { useEditorProject } from './useEditorProject'

export function useHeaderAppearance() {
  const { dispatch } = useEditorProject()

  const updateHeaderBackgroundColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      dispatch({
        type: 'set-header-background-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateHeaderTextColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      dispatch({
        type: 'set-header-text-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateHeaderFontFamily = useCallback(
    (elementId: string, fontFamily: TextFontFamily) => {
      dispatch({
        type: 'set-header-font-family',
        elementId,
        fontFamily,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateHeaderFontSize = useCallback(
    (elementId: string, fontSize: TextFontSize) => {
      dispatch({
        type: 'set-header-font-size',
        elementId,
        fontSize,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateHeaderFrameWidth = useCallback(
    (elementId: string, width: ElementFrameWidth) => {
      dispatch({
        type: 'set-header-frame-width',
        elementId,
        width,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateHeaderFrameColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      dispatch({
        type: 'set-header-frame-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  return {
    updateHeaderBackgroundColor,
    updateHeaderTextColor,
    updateHeaderFontFamily,
    updateHeaderFontSize,
    updateHeaderFrameWidth,
    updateHeaderFrameColor,
  }
}
