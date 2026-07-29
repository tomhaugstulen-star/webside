import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
  type ImageAssetId,
  type ImageAssetMetadata,
} from '../../model/imageAsset'
import {
  ImageAssetStoreContext,
  type ImageAssetResource,
} from './imageAssetStoreContext'

type ImageAssetMap = ReadonlyMap<ImageAssetId, ImageAssetResource>

export function ImageAssetStoreProvider({ children }: PropsWithChildren) {
  const [resources, setResources] = useState<ImageAssetMap>(() => new Map())
  const resourcesRef = useRef(resources)

  useEffect(() => {
    resourcesRef.current = resources
  }, [resources])

  useEffect(
    () => () => {
      resourcesRef.current.forEach((resource) => {
        URL.revokeObjectURL(resource.objectUrl)
      })
    },
    [],
  )

  const registerImageAsset = useCallback(
    (assetId: ImageAssetId, file: File, metadata: ImageAssetMetadata) => {
      if (
        !isImageAssetId(assetId) ||
        !isValidImageAssetMetadata(metadata) ||
        file.name !== metadata.fileName ||
        file.type !== metadata.mimeType ||
        file.size !== metadata.byteSize ||
        resourcesRef.current.has(assetId)
      ) {
        return false
      }

      let objectUrl: string

      try {
        objectUrl = URL.createObjectURL(file)
      } catch {
        return false
      }

      const nextResources = new Map(resourcesRef.current)
      nextResources.set(assetId, {
        file,
        objectUrl,
        metadata: { ...metadata },
      })
      resourcesRef.current = nextResources
      setResources(nextResources)
      return true
    },
    [],
  )

  const removeImageAsset = useCallback((assetId: ImageAssetId) => {
    const resource = resourcesRef.current.get(assetId)

    if (!resource) {
      return
    }

    URL.revokeObjectURL(resource.objectUrl)
    const nextResources = new Map(resourcesRef.current)
    nextResources.delete(assetId)
    resourcesRef.current = nextResources
    setResources(nextResources)
  }, [])

  const getImageAsset = useCallback(
    (assetId: ImageAssetId) => resources.get(assetId) ?? null,
    [resources],
  )

  const value = useMemo(
    () => ({ registerImageAsset, removeImageAsset, getImageAsset }),
    [registerImageAsset, removeImageAsset, getImageAsset],
  )

  return (
    <ImageAssetStoreContext.Provider value={value}>
      {children}
    </ImageAssetStoreContext.Provider>
  )
}
