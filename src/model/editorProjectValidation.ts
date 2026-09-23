import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorElement,
  type EditorProject,
} from './editorProject'
import { isValidEditorElement } from './editorElementValidation'
import {
  migrateEditorProjectV10,
  migrateEditorProjectV11,
  migrateEditorProjectV12,
  migrateEditorProjectV13,
  type EditorProjectV10,
  type EditorProjectV11,
  type EditorProjectV12,
  type EditorProjectV13,
} from './editorProjectMigration'
import { isValidPageAppearance } from './pageAppearance'
import {
  isValidPageName,
  isValidPageSlug,
  isValidProjectSiteStructure,
} from './siteStructure'

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
      !page.elements.every(isValidEditorElement)
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

  try {
    if (value.schemaVersion === 10) {
      migrated = migrateEditorProjectV10(value as unknown as EditorProjectV10)
    } else if (value.schemaVersion === 11) {
      migrated = migrateEditorProjectV11(value as unknown as EditorProjectV11)
    } else if (value.schemaVersion === 12) {
      migrated = migrateEditorProjectV12(value as unknown as EditorProjectV12)
    } else if (value.schemaVersion === 13) {
      migrated = migrateEditorProjectV13(value as unknown as EditorProjectV13)
    } else if (value.schemaVersion !== EDITOR_PROJECT_SCHEMA_VERSION) {
      return null
    }
  } catch {
    return null
  }

  return isValidEditorProject(migrated) ? migrated : null
}
