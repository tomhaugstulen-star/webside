import { useCallback } from 'react'
import type { ElementLayout } from '../model/elementLayout'
import { useEditorProject } from './useEditorProject'

export function useElementLayout() {
  const { dispatch } = useEditorProject()

  const commitElementDesktopLayout = useCallback(
    (elementId: string, layout: ElementLayout) => {
      dispatch({
        type: 'set-element-desktop-layout',
        elementId,
        layout,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { commitElementDesktopLayout }
}
