import { isKnownButtonAssetId, normalizeButtonLabel } from './buttonAsset'
import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorElement,
  type EditorProject,
  type ResponsiveValue,
} from './editorProject'
import {
  migrateEditorProjectV10,
  migrateEditorProjectV11,
  type EditorProjectV10,
  type EditorProjectV11,
} from './editorProjectMigration'
import { isValidElementLayout } from './elementLayout'
import { isValidElementLink } from './elementLink'
import { isValidHeaderAppearance } from './headerAppearance'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from './imageAsset'
import {
  isImageMode,
  normalizeImageTransform,
  type ImageTransform,
} from './imagePresentation'
import { isValidPageAppearance } from './pageAppearance'
import { isValidSectionAppearance } from './sectionAppearance'
import {
  isValidPageName,
  isValidPageSlug,
  isValidProjectSiteStructure,
} from './siteStructure'
import { isValidTextAppearance } from './textAppearance'
import { isValidTextElementStyle } from './textElementStyle'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actual = Object.keys(value)
  return actual.length === keys.length && actual.every((key) => keys.includes(key))
}

function isReference(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function isPosition(value: unknown) {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['x', 'y']) &&
    typeof value.x === 'number' &&
    Number.isFinite(value.x) &&
    typeof value.y === 'number' &&
    Number.isFinite(value.y)
  )
}

function isSize(value: unknown) {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['width', 'height']) &&
    typeof value.width === 'number' &&
    Number.isFinite(value.width) &&
    typeof value.height === 'number' &&
    Number.isFinite(value.height)
  )
}

function isResponsiveValue(
  value: unknown,
  validator: (candidate: unknown) => boolean,
): value is ResponsiveValue<unknown> {
  if (!isRecord(value)) return false
  const keys = Object.keys(value)
  return (
    keys.every((key) => key === 'desktop' || key === 'mobile') &&
    keys.includes('desktop') &&
    validator(value.desktop) &&
    (value.mobile === undefined || validator(value.mobile))
  )
}

function hasValidLayouts(element: Record<string, unknown>, kind: EditorElement['kind']) {
  if (
    !isResponsiveValue(element.position, isPosition) ||
    !isResponsiveValue(element.size, isSize) ||
    !isResponsiveValue(element.visibility, (value) => typeof value === 'boolean')
  ) {
    return false
  }

  const positions = element.position as ResponsiveValue<{ x: number; y: number }>
  const sizes = element.size as ResponsiveValue<{ width: number; height: number }>

  const desktopValid = isValidElementLayout(kind, {
    position: positions.desktop,
    size: sizes.desktop,
  })
  const mobileValid =
    positions.mobile === undefined && sizes.mobile === undefined
      ? true
      : positions.mobile !== undefined &&
        sizes.mobile !== undefined &&
        isValidElementLayout(kind, {
          position: positions.mobile,
          size: sizes.mobile,
        })

  return desktopValid && mobileValid
}

function isExactImageTransform(value: unknown): value is ImageTransform {
  const normalized = normalizeImageTransform(value)
  if (!normalized || !isRecord(value)) return false
  return (
    value.zoom === normalized.zoom &&
    value.offsetX === normalized.offsetX &&
    value.offsetY === normalized.offsetY
  )
}

function hasValidCommonElementFields(
  element: Record<string, unknown>,
  kind: EditorElement['kind'],
) {
  return (
    isReference(element.id) &&
    element.kind === kind &&
    typeof element.locked === 'boolean' &&
    hasValidLayouts(element, kind)
  )
}

function isValidElement(value: unknown): value is EditorElement {
  if (!isRecord(value) || typeof value.kind !== 'string') return false

  switch (value.kind) {
    case 'section':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          'kind', 'anchorId', 'appearance',
        ]) &&
        hasValidCommonElementFields(value, 'section') &&
        typeof value.anchorId === 'string' &&
        isValidSectionAppearance(value.appearance)
      )
    case 'image':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked', 'kind',
          'assetId', 'assetMetadata', 'altText', 'mode', 'transform',
        ]) &&
        hasValidCommonElementFields(value, 'image') &&
        isImageAssetId(value.assetId) &&
        isValidImageAssetMetadata(value.assetMetadata) &&
        typeof value.altText === 'string' &&
        isImageMode(value.mode) &&
        isExactImageTransform(value.transform)
      )
    case 'text':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked', 'kind',
          'content', 'appearance', 'textStyle', 'link',
        ]) &&
        hasValidCommonElementFields(value, 'text') &&
        typeof value.content === 'string' &&
        isValidTextAppearance(value.appearance) &&
        isValidTextElementStyle(value.textStyle) &&
        isValidElementLink(value.link)
      )
    case 'button':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          'kind', 'assetId', 'label', 'link',
        ]) &&
        hasValidCommonElementFields(value, 'button') &&
        isKnownButtonAssetId(value.assetId) &&
        typeof value.label === 'string' &&
        normalizeButtonLabel(value.label) === value.label &&
        isValidElementLink(value.link)
      )
    case 'header':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked', 'kind',
          'logoAssetId', 'logoAssetMetadata', 'siteName', 'subtitle', 'appearance',
        ]) &&
        hasValidCommonElementFields(value, 'header') &&
        isImageAssetId(value.logoAssetId) &&
        isValidImageAssetMetadata(value.logoAssetMetadata) &&
        typeof value.siteName === 'string' &&
        typeof value.subtitle === 'string' &&
        isValidHeaderAppearance(value.appearance)
      )
    default:
      return false
  }
}

export function isValidEditorProject(value: unknown): value is EditorProject {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      'schemaVersion', 'id', 'name', 'pages',
      'navigation', 'createdAt', 'updatedAt',
    ]) ||
    value.schemaVersion !== EDITOR_PROJECT_SCHEMA_VERSION ||
    !isReference(value.id) ||
    typeof value.name !== 'string' ||
    value.name.trim().length === 0 ||
    !Array.isArray(value.pages) ||
    value.pages.length === 0 ||
    !isTimestamp(value.createdAt) ||
    !isTimestamp(value.updatedAt)
  ) {
    return false
  }

  const elementIds = new Set<string>()
  for (const page of value.pages) {
    if (
      !isRecord(page) ||
      !hasExactKeys(page, ['id', 'name', 'slug', 'appearance', 'elements']) ||
      !isReference(page.id) ||
      !isValidPageName(page.name) ||
      !isValidPageSlug(page.slug) ||
      !isValidPageAppearance(page.appearance) ||
      !Array.isArray(page.elements) ||
      !page.elements.every(isValidElement)
    ) {
      return false
    }

    for (const element of page.elements as EditorElement[]) {
      if (elementIds.has(element.id)) return false
      elementIds.add(element.id)
    }
  }

  return isValidProjectSiteStructure(value)
}

function hasMigratableShape(value: unknown) {
  return (
    isRecord(value) &&
    Array.isArray(value.pages) &&
    value.pages.every(
      (page) => isRecord(page) && Array.isArray(page.elements),
    )
  )
}

export function parseImportedEditorProject(value: unknown): EditorProject | null {
  if (!hasMigratableShape(value) || !isRecord(value)) return null

  let migrated: unknown = value
  if (value.schemaVersion === 10) {
    migrated = migrateEditorProjectV10(value as unknown as EditorProjectV10)
  } else if (value.schemaVersion === 11) {
    migrated = migrateEditorProjectV11(value as unknown as EditorProjectV11)
  } else if (value.schemaVersion !== EDITOR_PROJECT_SCHEMA_VERSION) {
    return null
  }

  return isValidEditorProject(migrated) ? migrated : null
}
