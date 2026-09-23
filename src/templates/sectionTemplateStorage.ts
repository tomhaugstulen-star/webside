import { isValidEditorElement } from '../model/editorElementValidation'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from '../model/imageAsset'
import {
  isValidSectionTemplateName,
  SECTION_TEMPLATE_VERSION,
  type SectionTemplate,
  type SectionTemplateAsset,
} from './sectionTemplate'

const DATABASE_NAME = 'website-editor-templates'
const DATABASE_VERSION = 1
const TEMPLATE_STORE = 'section-templates'

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
      if (!database.objectStoreNames.contains(TEMPLATE_STORE)) {
        database.createObjectStore(TEMPLATE_STORE, { keyPath: 'id' })
      }
    })
    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => reject(request.error))
    request.addEventListener('blocked', () =>
      reject(new Error('Template database upgrade is blocked.')),
    )
  })
}

function isValidAsset(value: unknown): value is SectionTemplateAsset {
  if (typeof value !== 'object' || value === null) return false
  const asset = value as Partial<SectionTemplateAsset>

  return (
    isImageAssetId(asset.assetId) &&
    isValidImageAssetMetadata(asset.metadata) &&
    asset.file instanceof File &&
    asset.file.name === asset.metadata.fileName &&
    asset.file.type === asset.metadata.mimeType &&
    asset.file.size === asset.metadata.byteSize
  )
}

export function isValidSectionTemplate(value: unknown): value is SectionTemplate {
  if (typeof value !== 'object' || value === null) return false
  const template = value as Partial<SectionTemplate>

  return (
    template.version === SECTION_TEMPLATE_VERSION &&
    typeof template.id === 'string' &&
    template.id.trim().length > 0 &&
    isValidSectionTemplateName(template.name) &&
    typeof template.createdAt === 'string' &&
    Number.isFinite(Date.parse(template.createdAt)) &&
    Array.isArray(template.elements) &&
    template.elements.length > 0 &&
    template.elements.every(isValidEditorElement) &&
    template.elements.filter((element) => element.kind === 'section').length === 1 &&
    !template.elements.some((element) => element.kind === 'header') &&
    Array.isArray(template.assets) &&
    template.assets.every(isValidAsset) &&
    new Set(template.assets.map((asset) => asset.assetId)).size ===
      template.assets.length
  )
}

async function loadAll() {
  const database = await openDatabase()

  try {
    const transaction = database.transaction(TEMPLATE_STORE, 'readonly')
    const raw = await requestResult(
      transaction.objectStore(TEMPLATE_STORE).getAll(),
    )
    await transactionDone(transaction)

    if (!Array.isArray(raw) || !raw.every(isValidSectionTemplate)) {
      throw new Error('Invalid local section template storage.')
    }

    return (raw as SectionTemplate[]).sort((first, second) =>
      second.createdAt.localeCompare(first.createdAt),
    )
  } finally {
    database.close()
  }
}

async function save(template: SectionTemplate) {
  if (!isValidSectionTemplate(template)) {
    throw new Error('Invalid section template.')
  }

  const database = await openDatabase()
  try {
    const transaction = database.transaction(TEMPLATE_STORE, 'readwrite')
    transaction.objectStore(TEMPLATE_STORE).put(template)
    await transactionDone(transaction)
  } finally {
    database.close()
  }
}

async function remove(templateId: string) {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(TEMPLATE_STORE, 'readwrite')
    transaction.objectStore(TEMPLATE_STORE).delete(templateId)
    await transactionDone(transaction)
  } finally {
    database.close()
  }
}

export const sectionTemplateStorage = {
  loadAll,
  save,
  remove,
}
