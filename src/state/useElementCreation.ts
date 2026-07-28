import { useCallback } from 'react'
import { createStableId } from '../model/createStableId'
import type { ElementKind } from '../model/editorProject'
import { useEditorProject } from './useEditorProject'

export function useElementCreation() {
  const { dispatch } = useEditorProject()

  const createElement = useCallback(
    (kind: ElementKind) => {
      dispatch({
        type: 'add-element-to-active-page',
        elementId: createStableId(),
        kind,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  return { createElement }
}
