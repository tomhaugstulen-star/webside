import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { useEditorProject } from './useEditorProject'
import { useHeaderAppearance } from './useHeaderAppearance'
import { useSectionAppearance } from './useSectionAppearance'
import { useTextAppearance } from './useTextAppearance'
import { useTextElementStyle } from './useTextElementStyle'

export function useProjectColors() {
  const { dispatch } = useEditorProject()
  const {
    updateHeaderBackgroundColor,
    updateHeaderTextColor,
    updateHeaderFrameColor,
  } = useHeaderAppearance()
  const { updateSectionBackgroundColor, updateSectionFrameColor } =
    useSectionAppearance()
  const { updateTextBackgroundColor } = useTextAppearance()
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
    updateTextBackgroundColor,
    updateTextColor,
    updateHeaderBackgroundColor,
    updateHeaderTextColor,
    updateHeaderFrameColor,
  }
}
