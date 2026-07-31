import type { ElementCreationRequest } from '../model/elementCreation'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
} from '../model/headerElement'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'
import { isKnownButtonAssetId } from '../model/buttonAsset'

export function isValidElementCreationRequest(
  request: ElementCreationRequest,
) {
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
      return isKnownButtonAssetId(request.assetId)
    case 'header':
      return (
        isImageAssetId(request.logoAssetId) &&
        isValidImageAssetMetadata(request.logoAssetMetadata) &&
        isValidHeaderSiteName(request.siteName) &&
        isValidHeaderSubtitle(request.subtitle)
      )
  }

  const unhandledRequest: never = request
  return unhandledRequest
}
