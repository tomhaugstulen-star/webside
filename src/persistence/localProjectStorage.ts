import type { EditorProject } from '../model/editorProject'
import type { ImageAssetId } from '../model/imageAsset'
import {
  createLocalProjectEnvelope,
  validateLocalProjectSnapshot,
} from './localProjectSnapshot'
import type {
  LocalProjectLoadResult,
  StoredImageAsset,
} from './localProjectTypes'

const DATABASE_NAME = 'website-editor'
const DATABASE_VERSION = 1
const PROJECT_STORE = 'project'
const ASSET_STORE = 'assets'
const ACTIVE_PROJECT_KEY = 'active'

type ProjectRecord = {
  key: typeof ACTIVE_PROJECT_KEY
  envelope: unknown
}

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB request failed.'))
  })
}

function transactionComplete(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () =>
      reject(transaction.error ?? new Error('IndexedDB transaction failed.'))
    transaction.onabort = () =>
      reject(transaction.error ?? new Error('IndexedDB transaction aborted.'))
  })
}

function openDatabase(factory: IDBFactory) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = factory.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(PROJECT_STORE)) {
        database.createObjectStore(PROJECT_STORE, { keyPath: 'key' })
      }

      if (!database.objectStoreNames.contains(ASSET_STORE)) {
        database.createObjectStore(ASSET_STORE, { keyPath: 'assetId' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB could not be opened.'))
    request.onblocked = () =>
      reject(new Error('IndexedDB upgrade was blocked by another tab.'))
  })
}

function getFactory(factory?: IDBFactory) {
  return factory ?? globalThis.indexedDB
}

export async function readLocalProject(
  factory?: IDBFactory,
): Promise<LocalProjectLoadResult> {
  const resolvedFactory = getFactory(factory)

  if (!resolvedFactory) {
    return {
      status: 'error',
      reason: 'storage-unavailable',
      message: 'Nettleseren tilbyr ikke lokal prosjektlagring.',
    }
  }

  let database: IDBDatabase | null = null

  try {
    database = await openDatabase(resolvedFactory)
    const transaction = database.transaction(
      [PROJECT_STORE, ASSET_STORE],
      'readonly',
    )
    const projectRequest = transaction
      .objectStore(PROJECT_STORE)
      .get(ACTIVE_PROJECT_KEY)
    const assetsRequest = transaction.objectStore(ASSET_STORE).getAll()
    const projectResult = requestResult(
      projectRequest,
    ) as Promise<ProjectRecord | undefined>
    const assetsResult = requestResult(assetsRequest)
    const [projectRecord, assets] = await Promise.all([
      projectResult,
      assetsResult,
    ])
    await transactionComplete(transaction)

    if (!projectRecord) {
      return { status: 'empty' }
    }

    const snapshot = validateLocalProjectSnapshot(
      projectRecord.envelope,
      assets,
    )

    if (!snapshot) {
      return {
        status: 'error',
        reason: 'invalid-data',
        message:
          'Lagrede prosjektdata er ugyldige eller mangler nødvendige bilder.',
      }
    }

    return { status: 'ready', snapshot }
  } catch {
    return {
      status: 'error',
      reason: 'storage-unavailable',
      message: 'Lokal prosjektlagring kunne ikke leses.',
    }
  } finally {
    database?.close()
  }
}

export async function writeLocalProject(
  project: EditorProject,
  assets: readonly StoredImageAsset[],
  factory?: IDBFactory,
) {
  const resolvedFactory = getFactory(factory)

  if (!resolvedFactory) {
    throw new Error('IndexedDB is unavailable.')
  }

  const envelope = createLocalProjectEnvelope(project)

  if (!envelope) {
    throw new Error('The current project is not valid for persistence.')
  }

  const validatedSnapshot = validateLocalProjectSnapshot(envelope, assets)

  if (!validatedSnapshot) {
    throw new Error('Required image assets are missing or invalid.')
  }

  const database = await openDatabase(resolvedFactory)

  try {
    const transaction = database.transaction(
      [PROJECT_STORE, ASSET_STORE],
      'readwrite',
    )
    const projectStore = transaction.objectStore(PROJECT_STORE)
    const assetStore = transaction.objectStore(ASSET_STORE)
    const existingKeysRequest = assetStore.getAllKeys()

    projectStore.put({
      key: ACTIVE_PROJECT_KEY,
      envelope: validatedSnapshot.envelope,
    } satisfies ProjectRecord)

    validatedSnapshot.assets.forEach((asset) => {
      assetStore.put(asset)
    })

    const existingKeys = await requestResult(existingKeysRequest)
    const referencedIds = new Set<ImageAssetId>(
      validatedSnapshot.assets.map((asset) => asset.assetId),
    )

    existingKeys.forEach((key) => {
      if (typeof key === 'string' && !referencedIds.has(key as ImageAssetId)) {
        assetStore.delete(key)
      }
    })

    await transactionComplete(transaction)
  } finally {
    database.close()
  }
}

export async function clearLocalProject(factory?: IDBFactory) {
  const resolvedFactory = getFactory(factory)

  if (!resolvedFactory) {
    throw new Error('IndexedDB is unavailable.')
  }

  const database = await openDatabase(resolvedFactory)

  try {
    const transaction = database.transaction(
      [PROJECT_STORE, ASSET_STORE],
      'readwrite',
    )
    transaction.objectStore(PROJECT_STORE).clear()
    transaction.objectStore(ASSET_STORE).clear()
    await transactionComplete(transaction)
  } finally {
    database.close()
  }
}
