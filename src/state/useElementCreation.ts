import { useCallback } from 'react'
import { findButtonAsset } from '../assets/buttons/buttonAssetCatalog'
import { createStableId } from '../model/createStableId'
import type { ElementCreationRequest } from '../model/elementCreation'
import { useEditorProject } from './useEditorProject'

export function useElementCreation() {
  const { dispatch } = useEditorProject()

  const createElement = useCallback(
    (request: ElementCreationRequest) => {
      if (
        request.kind === 'button' &&
        findButtonAsset(request.assetId) === null
      ) {
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
