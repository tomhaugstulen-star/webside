import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorPage,
  type EditorProject,
} from '../model/editorProject'
import type {
  ImageAssetId,
  ImageAssetMetadata,
} from '../model/imageAsset'
import { isValidPageAppearance } from '../model/pageAppearance'
import { isValidEditorElement } from './editorElementValidation'
import {
  hasExactKeys,
  isIsoTimestamp,
  isRecord,
  isStableId,
} from './validationHelpers'

function isValidEditorPage(value: unknown): value is EditorPage {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['id', 'name', 'slug', 'appearance', 'elements']) &&
    isStableId(value.id) &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    value.name === value.name.trim() &&
    typeof value.slug === 'string' &&
    value.slug.startsWith('/') &&
    value.slug === value.slug.trim() &&
    isValidPageAppearance(value.appearance) &&
    Array.isArray(value.elements) &&
    value.elements.every(isValidEditorElement)
  )
}

function hasUniqueIds(project: EditorProject) {
  const ids = new Set<string>()

  const registerId = (id: string) => {
    if (ids.has(id)) {
      return false
    }
    ids.add(id)
    return true
  }

  return (
    registerId(project.id) &&
    project.pages.every(
      (page) =>
        registerId(page.id) &&
        page.elements.every((element) => registerId(element.id)),
    )
  )
}

export function imageAssetMetadataEqual(
  first: ImageAssetMetadata,
  second: ImageAssetMetadata,
) {
  return (
    first.fileName === second.fileName &&
    first.mimeType === second.mimeType &&
    first.byteSize === second.byteSize &&
    first.width === second.width &&
    first.height === second.height
  )
}

export function isValidEditorProject(
  value: unknown,
): value is EditorProject {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion',
      'id',
      'name',
      'pages',
      'createdAt',
      'updatedAt',
    ]) ||
    value.schemaVersion !== EDITOR_PROJECT_SCHEMA_VERSION ||
    !isStableId(value.id) ||
    typeof value.name !== 'string' ||
    value.name.trim().length === 0 ||
    value.name !== value.name.trim() ||
    !Array.isArray(value.pages) ||
    value.pages.length === 0 ||
    !value.pages.every(isValidEditorPage) ||
    !isIsoTimestamp(value.createdAt) ||
    !isIsoTimestamp(value.updatedAt) ||
    Date.parse(value.createdAt) > Date.parse(value.updatedAt)
  ) {
    return false
  }

  return hasUniqueIds(value as EditorProject)
}

export function getReferencedImageAssetMetadata(project: EditorProject) {
  const metadataById = new Map<ImageAssetId, ImageAssetMetadata>()

  for (const page of project.pages) {
    for (const element of page.elements) {
      const reference =
        element.kind === 'image'
          ? { assetId: element.assetId, metadata: element.assetMetadata }
          : element.kind === 'header'
            ? {
                assetId: element.logoAssetId,
                metadata: element.logoAssetMetadata,
              }
            : null

      if (!reference) {
        continue
      }

      const existingMetadata = metadataById.get(reference.assetId)

      if (
        existingMetadata &&
        !imageAssetMetadataEqual(existingMetadata, reference.metadata)
      ) {
        return null
      }

      metadataById.set(reference.assetId, reference.metadata)
    }
  }

  return metadataById
}

export function getReferencedImageAssetIds(project: EditorProject) {
  const metadataById = getReferencedImageAssetMetadata(project)
  return new Set<ImageAssetId>(metadataById?.keys() ?? [])
}
