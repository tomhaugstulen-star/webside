import { isValidEditorProject } from '../model/editorProjectValidation'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
  type ImageAssetId,
} from '../model/imageAsset'
import {
  getProjectAssetReferences,
  imageAssetMetadataEqual,
} from '../projectFiles/projectAssetReferences'
import {
  LOCAL_PROJECT_STORAGE_VERSION,
  type LocalProjectSnapshot,
  type LocalProjectStorage,
  type PersistedImageAsset,
} from './localProjectStorage'

const DATABASE_NAME = 'website-editor'
const DATABASE_VERSION = 1
const PROJECT_STORE = 'project'
const ASSET_STORE = 'assets'
const CURRENT_PROJECT_KEY = 'current'

type PersistedProjectRecord = {
  key: typeof CURRENT_PROJECT_KEY
  storageVersion: number
  project: unknown
}

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => reject(request.error))
  })
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.addEventListener('complete', () => resolve())
    transaction.addEventListener('abort', () => reject(transaction.error))
    transaction.addEventListener('error', () => reject(transaction.error))
  })
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.addEventListener('upgradeneeded', () => {
      const database = request.result
      if (!database.objectStoreNames.contains(PROJECT_STORE)) {
        database.createObjectStore(PROJECT_STORE, { keyPath: 'key' })
      }
      if (!database.objectStoreNames.contains(ASSET_STORE)) {
        database.createObjectStore(ASSET_STORE, { keyPath: 'assetId' })
      }
    })

    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => reject(request.error))
    request.addEventListener('blocked', () =>
      reject(new Error('IndexedDB upgrade is blocked.')),
    )
  })
}

function isPersistedAsset(value: unknown): value is PersistedImageAsset {
  if (typeof value !== 'object' || value === null) return false
  const asset = value as Partial<PersistedImageAsset>

  return (
    isImageAssetId(asset.assetId) &&
    isValidImageAssetMetadata(asset.metadata) &&
    asset.file instanceof File &&
    asset.file.name === asset.metadata.fileName &&
    asset.file.type === asset.metadata.mimeType &&
    asset.file.size === asset.metadata.byteSize
  )
}

async function loadSnapshot(): Promise<LocalProjectSnapshot | null> {
  const database = await openDatabase()

  try {
    const transaction = database.transaction(
      [PROJECT_STORE, ASSET_STORE],
      'readonly',
    )
    const projectRecord = (await requestResult(
      transaction.objectStore(PROJECT_STORE).get(CURRENT_PROJECT_KEY),
    )) as PersistedProjectRecord | undefined

    if (!projectRecord) {
      await transactionDone(transaction)
      return null
    }

    const rawAssets = await requestResult(
      transaction.objectStore(ASSET_STORE).getAll(),
    )
    await transactionDone(transaction)

    if (
      projectRecord.storageVersion !== LOCAL_PROJECT_STORAGE_VERSION ||
      !isValidEditorProject(projectRecord.project) ||
      !Array.isArray(rawAssets)
    ) {
      throw new Error('Invalid local project storage.')
    }

    const assets = rawAssets.filter(isPersistedAsset)
    if (assets.length !== rawAssets.length) {
      throw new Error('Invalid local image asset storage.')
    }

    const references = getProjectAssetReferences(projectRecord.project)
    if (!references) throw new Error('Invalid local asset references.')

    const byId = new Map<ImageAssetId, PersistedImageAsset>()
    for (const asset of assets) {
      if (byId.has(asset.assetId)) throw new Error('Duplicate local asset.')
      byId.set(asset.assetId, asset)
    }

    const referencedAssets = references.map((reference) => {
      const asset = byId.get(reference.assetId)
      if (
        !asset ||
        !imageAssetMetadataEqual(reference.metadata, asset.metadata)
      ) {
        throw new Error('Missing local project asset.')
      }
      return asset
    })

    return {
      storageVersion: LOCAL_PROJECT_STORAGE_VERSION,
      project: projectRecord.project,
      assets: referencedAssets,
    }
  } finally {
    database.close()
  }
}

async function saveSnapshot(snapshot: LocalProjectSnapshot) {
  const database = await openDatabase()

  try {
    const transaction = database.transaction(
      [PROJECT_STORE, ASSET_STORE],
      'readwrite',
    )
    const projectStore = transaction.objectStore(PROJECT_STORE)
    const assetStore = transaction.objectStore(ASSET_STORE)

    projectStore.put({
      key: CURRENT_PROJECT_KEY,
      storageVersion: snapshot.storageVersion,
      project: snapshot.project,
    } satisfies PersistedProjectRecord)

    assetStore.clear()
    for (const asset of snapshot.assets) {
      assetStore.put(asset)
    }

    await transactionDone(transaction)
  } finally {
    database.close()
  }
}

async function clearStorage() {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(
      [PROJECT_STORE, ASSET_STORE],
      'readwrite',
    )
    transaction.objectStore(PROJECT_STORE).clear()
    transaction.objectStore(ASSET_STORE).clear()
    await transactionDone(transaction)
  } finally {
    database.close()
  }
}

export const indexedDbLocalProjectStorage: LocalProjectStorage = {
  load: loadSnapshot,
  save: saveSnapshot,
  clear: clearStorage,
}
