import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import type { SectionFrameWidth } from '../model/sectionAppearance'
import { useEditorProject } from './useEditorProject'

export function useSectionAppearance() {
  const { dispatch } = useEditorProject()

  const updateSectionBackgroundColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      dispatch({
        type: 'set-section-background-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateSectionFrameWidth = useCallback(
    (elementId: string, width: SectionFrameWidth) => {
      dispatch({
        type: 'set-section-frame-width',
        elementId,
        width,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateSectionFrameColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)

      if (!color) {
        return false
      }

      dispatch({
        type: 'set-section-frame-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  return {
    updateSectionBackgroundColor,
    updateSectionFrameWidth,
    updateSectionFrameColor,
  }
}
