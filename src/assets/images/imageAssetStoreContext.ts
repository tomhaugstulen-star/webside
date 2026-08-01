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

export type ImageAssetSource = {
  assetId: ImageAssetId
  file: File
  metadata: ImageAssetMetadata
}

export type ImageAssetHydrationStatus = 'loading' | 'ready' | 'error'

export type ImageAssetStoreContextValue = {
  hydrationStatus: ImageAssetHydrationStatus
  hydrationError: string | null
  registerImageAsset: (
    assetId: ImageAssetId,
    file: File,
    metadata: ImageAssetMetadata,
  ) => boolean
  removeImageAsset: (assetId: ImageAssetId) => void
  getImageAsset: (assetId: ImageAssetId) => ImageAssetResource | null
  getAllImageAssets: () => ImageAssetSource[]
}

export const ImageAssetStoreContext =
  createContext<ImageAssetStoreContextValue | null>(null)
