import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import type { ElementFrameWidth } from '../model/elementFrame'
import { useEditorProject } from './useEditorProject'

export function useHeaderAppearance() {
  const { dispatch } = useEditorProject()

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
    updateHeaderTextColor,
    updateHeaderFrameWidth,
    updateHeaderFrameColor,
  }
}
