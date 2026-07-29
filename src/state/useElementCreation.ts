import { useCallback } from 'react'
import { createStableId } from '../model/createStableId'
import type { ElementCreationRequest } from '../model/elementCreation'
import { isValidElementCreationRequest } from './isValidElementCreationRequest'
import { useEditorProject } from './useEditorProject'

export function useElementCreation() {
  const { dispatch } = useEditorProject()

  const createElement = useCallback(
    (request: ElementCreationRequest) => {
      if (!isValidElementCreationRequest(request)) {
        return false
      }

      dispatch({
        type: 'add-element-to-active-page',
        elementId: createStableId(),
        request,
        updatedAt: new Date().toISOString(),
      })

      return true
    },
    [dispatch],
  )

  return { createElement }
}
