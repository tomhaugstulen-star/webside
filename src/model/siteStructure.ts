import {
  hasValidNavigationReferences,
  isValidWebsiteNavigation,
} from './navigation'

export const MAX_PAGE_NAME_LENGTH = 80
export const MAX_PAGE_SLUG_LENGTH = 100
export const MAX_SECTION_ANCHOR_ID_LENGTH = 80

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeIdentifierToken(value: string) {
  return value
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizePageName(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidPageName(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_PAGE_NAME_LENGTH &&
    normalizePageName(value) === value
  )
}

export function normalizePageSlug(value: string): string | null {
  const trimmed = value.trim()

  if (trimmed === '/') {
    return '/'
  }

  const token = normalizeIdentifierToken(trimmed.replace(/^\/+|\/+$/g, ''))

  if (!token) {
    return null
  }

  const slug = `/${token}`
  return slug.length <= MAX_PAGE_SLUG_LENGTH ? slug : null
}

export function isValidPageSlug(value: unknown): value is string {
  return typeof value === 'string' && normalizePageSlug(value) === value
}

export function createUniquePageSlug(
  existingSlugs: readonly string[],
  preferredValue = 'side',
) {
  const normalized = normalizePageSlug(preferredValue)
  const preferred = normalized && normalized !== '/' ? normalized : '/side'
  const used = new Set(existingSlugs)

  if (!used.has(preferred)) {
    return preferred
  }

  let suffix = 2

  while (true) {
    const suffixText = `-${suffix}`
    const base = preferred.slice(0, MAX_PAGE_SLUG_LENGTH - suffixText.length)
    const candidate = `${base}${suffixText}`

    if (!used.has(candidate)) {
      return candidate
    }

    suffix += 1
  }
}

export function normalizeSectionAnchorId(value: string): string | null {
  const token = normalizeIdentifierToken(value.trim().replace(/^#+/, ''))

  if (!token || token.length > MAX_SECTION_ANCHOR_ID_LENGTH) {
    return null
  }

  return token
}

export function isValidSectionAnchorId(value: unknown): value is string {
  return typeof value === 'string' && normalizeSectionAnchorId(value) === value
}

export function createUniqueSectionAnchorId(
  existingAnchorIds: readonly string[],
  preferredValue = 'seksjon',
) {
  const preferred = normalizeSectionAnchorId(preferredValue) ?? 'seksjon'
  const used = new Set(existingAnchorIds)

  if (!used.has(preferred)) {
    return preferred
  }

  let suffix = 2

  while (true) {
    const suffixText = `-${suffix}`
    const base = preferred.slice(
      0,
      MAX_SECTION_ANCHOR_ID_LENGTH - suffixText.length,
    )
    const candidate = `${base}${suffixText}`

    if (!used.has(candidate)) {
      return candidate
    }

    suffix += 1
  }
}

export function hasUniquePageSlugs(pages: readonly { slug: string }[]) {
  return new Set(pages.map((page) => page.slug)).size === pages.length
}

type SiteStructureElement = {
  id: string
  kind: string
  anchorId?: unknown
}

export function hasUniqueSectionAnchorIds(
  elements: ReadonlyArray<SiteStructureElement>,
) {
  const anchorIds = elements
    .filter((element) => element.kind === 'section')
    .map((element) => element.anchorId)

  return (
    anchorIds.every(isValidSectionAnchorId) &&
    new Set(anchorIds).size === anchorIds.length
  )
}

type SiteStructurePage = {
  id: string
  name: string
  slug: string
  elements: SiteStructureElement[]
}

function isValidSiteStructureElement(value: unknown): value is SiteStructureElement {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.kind === 'string'
  )
}

function isValidSiteStructurePage(value: unknown): value is SiteStructurePage {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    value.id.length === 0 ||
    !isValidPageName(value.name) ||
    !isValidPageSlug(value.slug) ||
    !Array.isArray(value.elements) ||
    !value.elements.every(isValidSiteStructureElement)
  ) {
    return false
  }

  return hasUniqueSectionAnchorIds(value.elements)
}

export function isValidProjectSiteStructure(value: unknown) {
  if (!isRecord(value)) {
    return false
  }

  const pages = value.pages
  const navigation = value.navigation

  if (
    !Array.isArray(pages) ||
    pages.length === 0 ||
    !pages.every(isValidSiteStructurePage) ||
    !hasUniquePageSlugs(pages) ||
    !isValidWebsiteNavigation(navigation)
  ) {
    return false
  }

  const pageIds = pages.map((page) => page.id)

  return (
    new Set(pageIds).size === pageIds.length &&
    hasValidNavigationReferences(navigation, pages)
  )
}
