import { useCallback } from 'react'
import { findButtonAsset } from '../assets/buttons/buttonAssetCatalog'
import { createStableId } from '../model/createStableId'
import type { ElementCreationRequest } from '../model/elementCreation'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'
import { useEditorProject } from './useEditorProject'

function requestIsValid(request: ElementCreationRequest) {
  switch (request.kind) {
    case 'section':
    case 'text':
      return true
    case 'image':
      return (
        isImageAssetId(request.assetId) &&
        isValidImageAssetMetadata(request.assetMetadata)
      )
    case 'button':
      return findButtonAsset(request.assetId) !== null
  }

  const unhandledRequest: never = request
  return unhandledRequest
}

export function useElementCreation() {
  const { dispatch } = useEditorProject()

  const createElement = useCallback(
    (request: ElementCreationRequest) => {
      if (!requestIsValid(request)) {
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
