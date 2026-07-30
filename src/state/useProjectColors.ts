import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { useSectionAppearance } from './useSectionAppearance'
import { useTextElementStyle } from './useTextElementStyle'
import { useEditorProject } from './useEditorProject'

export function useProjectColors() {
  const { dispatch } = useEditorProject()
  const { updateSectionBackgroundColor, updateSectionFrameColor } =
    useSectionAppearance()
  const { updateTextElementStyle } = useTextElementStyle()

  const updatePageBackgroundColor = useCallback(
    (value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      dispatch({
        type: 'set-active-page-background-color',
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateTextColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      updateTextElementStyle(elementId, { color })
      return true
    },
    [updateTextElementStyle],
  )

  return {
    updatePageBackgroundColor,
    updateSectionBackgroundColor,
    updateSectionFrameColor,
    updateTextColor,
  }
}
