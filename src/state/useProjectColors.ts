import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { isEditorFill, type EditorFill } from '../model/editorFill'
import { useEditorProject } from './useEditorProject'
import { useHeaderAppearance } from './useHeaderAppearance'
import { useSectionAppearance } from './useSectionAppearance'
import { useTextAppearance } from './useTextAppearance'
import { useTextElementStyle } from './useTextElementStyle'

export function useProjectColors() {
  const { dispatch } = useEditorProject()
  const { updateHeaderBackgroundFill, updateHeaderTextColor, updateHeaderFrameColor } =
    useHeaderAppearance()
  const { updateSectionBackgroundFill, updateSectionFrameColor } =
    useSectionAppearance()
  const { updateTextBackgroundFill } = useTextAppearance()
  const { updateTextElementStyle } = useTextElementStyle()

  const updatePageBackgroundFill = useCallback(
    (fill: EditorFill) => {
      if (!isEditorFill(fill)) return false
      dispatch({
        type: 'set-active-page-background-fill',
        fill,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateTextColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false
      updateTextElementStyle(elementId, { color })
      return true
    },
    [updateTextElementStyle],
  )

  return {
    updatePageBackgroundFill,
    updateSectionBackgroundFill,
    updateSectionFrameColor,
    updateTextBackgroundFill,
    updateTextColor,
    updateHeaderBackgroundFill,
    updateHeaderTextColor,
    updateHeaderFrameColor,
  }
}
