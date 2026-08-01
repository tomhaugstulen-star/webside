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
  type ImageAssetSource,
} from './imageAssetStoreContext'

type ImageAssetMap = ReadonlyMap<ImageAssetId, ImageAssetResource>

type ImageAssetStoreProviderProps = PropsWithChildren<{
  initialAssets?: readonly ImageAssetSource[]
}>

function sourceIsValid(source: ImageAssetSource) {
  return (
    isImageAssetId(source.assetId) &&
    isValidImageAssetMetadata(source.metadata) &&
    source.file.name === source.metadata.fileName &&
    source.file.type === source.metadata.mimeType &&
    source.file.size === source.metadata.byteSize
  )
}

export function ImageAssetStoreProvider({
  children,
  initialAssets = [],
}: ImageAssetStoreProviderProps) {
  const [resources, setResources] = useState<ImageAssetMap>(() => new Map())
  const [hydrationStatus, setHydrationStatus] = useState<
    'loading' | 'ready' | 'error'
  >(initialAssets.length === 0 ? 'ready' : 'loading')
  const [hydrationError, setHydrationError] = useState<string | null>(null)
  const resourcesRef = useRef(resources)

  useEffect(() => {
    resourcesRef.current = resources
  }, [resources])

  useEffect(() => {
    if (initialAssets.length === 0) {
      return
    }

    const nextResources = new Map<ImageAssetId, ImageAssetResource>()

    try {
      initialAssets.forEach((source) => {
        if (!sourceIsValid(source) || nextResources.has(source.assetId)) {
          throw new Error('Invalid initial image asset.')
        }

        nextResources.set(source.assetId, {
          file: source.file,
          objectUrl: URL.createObjectURL(source.file),
          metadata: { ...source.metadata },
        })
      })

      resourcesRef.current = nextResources
      setResources(nextResources)
      setHydrationStatus('ready')
    } catch {
      nextResources.forEach((resource) => {
        URL.revokeObjectURL(resource.objectUrl)
      })
      setHydrationError('Lagrede bilder kunne ikke åpnes.')
      setHydrationStatus('error')
    }
  }, [initialAssets])

  useEffect(
    () => () => {
      resourcesRef.current.forEach((resource) => {
        URL.revokeObjectURL(resource.objectUrl)
      })
      resourcesRef.current = new Map()
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

  const getAllImageAssets = useCallback(
    () =>
      [...resourcesRef.current].map(([assetId, resource]) => ({
        assetId,
        file: resource.file,
        metadata: { ...resource.metadata },
      })),
    [],
  )

  const value = useMemo(
    () => ({
      hydrationStatus,
      hydrationError,
      registerImageAsset,
      removeImageAsset,
      getImageAsset,
      getAllImageAssets,
    }),
    [
      getAllImageAssets,
      getImageAsset,
      hydrationError,
      hydrationStatus,
      registerImageAsset,
      removeImageAsset,
    ],
  )

  return (
    <ImageAssetStoreContext.Provider value={value}>
      {children}
    </ImageAssetStoreContext.Provider>
  )
}
