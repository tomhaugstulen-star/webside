import { useCallback } from 'react'
import { createEditorElement } from '../model/createEditorElement'
import type { ElementKind } from '../model/editorProject'
import { useEditorProject } from './useEditorProject'

export function useElementCreation() {
  const { activePage, dispatch } = useEditorProject()

  const createElement = useCallback(
    (kind: ElementKind) => {
      const element = createEditorElement(kind, activePage.elements)

      dispatch({
        type: 'add-element-to-active-page',
        element,
        updatedAt: new Date().toISOString(),
      })
    },
    [activePage.elements, dispatch],
  )

  return { createElement }
}
