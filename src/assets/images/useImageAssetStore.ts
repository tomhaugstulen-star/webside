import { useContext } from 'react'
import { ImageAssetStoreContext } from './imageAssetStoreContext'

export function useImageAssetStore() {
  const context = useContext(ImageAssetStoreContext)

  if (!context) {
    throw new Error('useImageAssetStore must be used inside ImageAssetStoreProvider.')
  }

  return context
}
