import { useCallback } from 'react'
import { createStableId } from '../model/createStableId'
import type { ElementCreationRequest } from '../model/elementCreation'
import { isValidElementCreationRequest } from './isValidElementCreationRequest'
import { useEditorProject } from './useEditorProject'

export function useElementCreation() {
  const { state, dispatch } = useEditorProject()

  const createElement = useCallback(
    (request: ElementCreationRequest) => {
      if (!isValidElementCreationRequest(request)) {
        return false
      }

      const activePageExists = state.project.pages.some(
        (page) => page.id === state.activePageId,
      )
      if (!activePageExists) {
        return false
      }

      const elementId = createStableId()
      const elementIdExists = state.project.pages.some((page) =>
        page.elements.some((element) => element.id === elementId),
      )
      if (elementIdExists) {
        return false
      }

      dispatch({
        type: 'add-element-to-active-page',
        elementId,
        request,
        updatedAt: new Date().toISOString(),
      })

      return true
    },
    [dispatch, state.activePageId, state.project.pages],
  )

  return { createElement }
}
