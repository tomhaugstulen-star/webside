import { useCallback } from 'react'
import { useEditorProject } from './useEditorProject'

export function useResponsiveElementControls() {
  const { dispatch } = useEditorProject()

  const setMobileVisibility = useCallback(
    (elementId: string, visible: boolean) => {
      dispatch({
        type: 'set-element-mobile-visibility',
        elementId,
        visible,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const resetMobileOverrides = useCallback(
    (elementId: string) => {
      dispatch({
        type: 'reset-element-mobile-overrides',
        elementId,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { setMobileVisibility, resetMobileOverrides }
}
