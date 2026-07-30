import { findButtonAsset } from '../assets/buttons/buttonAssetCatalog'
import type { ElementCreationRequest } from '../model/elementCreation'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
} from '../model/headerElement'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'

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
      return findButtonAsset(request.assetId) !== null
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
