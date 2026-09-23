import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { createSolidFill, isEditorFill, type EditorFill } from '../model/editorFill'
import type { SectionFrameWidth } from '../model/sectionAppearance'
import { useEditorProject } from './useEditorProject'

export function useSectionAppearance() {
  const { dispatch } = useEditorProject()

  const updateSectionBackgroundFill = useCallback(
    (elementId: string, fill: EditorFill) => {
      if (!isEditorFill(fill)) return false
      dispatch({
        type: 'set-section-background-fill',
        elementId,
        fill,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateSectionBackgroundColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      return color ? updateSectionBackgroundFill(elementId, createSolidFill(color)) : false
    },
    [updateSectionBackgroundFill],
  )

  const updateSectionFrameWidth = useCallback(
    (elementId: string, width: SectionFrameWidth) => {
      dispatch({ type: 'set-section-frame-width', elementId, width, updatedAt: new Date().toISOString() })
    },
    [dispatch],
  )

  const updateSectionFrameColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false
      dispatch({ type: 'set-section-frame-color', elementId, color, updatedAt: new Date().toISOString() })
      return true
    },
    [dispatch],
  )

  return {
    updateSectionBackgroundFill,
    updateSectionBackgroundColor,
    updateSectionFrameWidth,
    updateSectionFrameColor,
  }
}
