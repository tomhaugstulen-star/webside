import { createContext } from 'react'
import type {
  ImageAssetId,
  ImageAssetMetadata,
} from '../../model/imageAsset'

export type ImageAssetResource = {
  file: File
  objectUrl: string
  metadata: ImageAssetMetadata
}

export type ImageAssetStoreContextValue = {
  registerImageAsset: (
    assetId: ImageAssetId,
    file: File,
    metadata: ImageAssetMetadata,
  ) => boolean
  removeImageAsset: (assetId: ImageAssetId) => void
  getImageAsset: (assetId: ImageAssetId) => ImageAssetResource | null
}

export const ImageAssetStoreContext =
  createContext<ImageAssetStoreContextValue | null>(null)
