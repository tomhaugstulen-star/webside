import { useCallback } from 'react'
import type { HeaderWidthMode } from '../model/headerWidth'
import { useEditorProject } from './useEditorProject'

export function useHeaderWidth() {
  const { dispatch } = useEditorProject()

  const updateHeaderWidthMode = useCallback(
    (elementId: string, widthMode: HeaderWidthMode) => {
      dispatch({
        type: 'set-header-width-mode',
        elementId,
        widthMode,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { updateHeaderWidthMode }
}
