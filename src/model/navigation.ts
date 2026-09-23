export type PageNavigationTarget = {
  type: 'page'
  pageId: string
}

export type SectionNavigationTarget = {
  type: 'section'
  pageId: string
  elementId: string
}

export type NavigationTarget = PageNavigationTarget | SectionNavigationTarget

export type NavigationItem = {
  id: string
  label: string
  target: NavigationTarget
  parentId?: string
}

export type WebsiteNavigation = {
  items: NavigationItem[]
}

export const MAX_NAVIGATION_LABEL_LENGTH = 80

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasExactKeys(value: Record<string, unknown>, expectedKeys: readonly string[]) {
  const keys = Object.keys(value)

  return (
    keys.length === expectedKeys.length &&
    keys.every((key) => expectedKeys.includes(key))
  )
}

function isStableReference(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value
}

export function normalizeNavigationLabel(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidNavigationLabel(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_NAVIGATION_LABEL_LENGTH &&
    normalizeNavigationLabel(value) === value
  )
}

export function isValidNavigationTarget(value: unknown): value is NavigationTarget {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return false
  }

  if (value.type === 'page') {
    return (
      hasExactKeys(value, ['type', 'pageId']) && isStableReference(value.pageId)
    )
  }

  if (value.type === 'section') {
    return (
      hasExactKeys(value, ['type', 'pageId', 'elementId']) &&
      isStableReference(value.pageId) &&
      isStableReference(value.elementId)
    )
  }

  return false
}

export function isValidNavigationItem(value: unknown): value is NavigationItem {
  return (
    isRecord(value) &&
    hasExactKeys(value, value.parentId === undefined
      ? ['id', 'label', 'target'] : ['id', 'label', 'target', 'parentId']) &&
    isStableReference(value.id) &&
    isValidNavigationLabel(value.label) &&
    isValidNavigationTarget(value.target) &&
    (value.parentId === undefined || isStableReference(value.parentId))
  )
}

export function isValidWebsiteNavigation(value: unknown): value is WebsiteNavigation {
  if (!isRecord(value) || !hasExactKeys(value, ['items']) ||
    !Array.isArray(value.items) || !value.items.every(isValidNavigationItem)) return false
  const items: NavigationItem[] = value.items
  return new Set(items.map((item) => item.id)).size === items.length &&
    items.every((item) => !item.parentId || items.some(
      (parent) => parent.id === item.parentId && !parent.parentId,
    ))
}

type NavigationProjectPage = {
  id: string
  elements: Array<{ id: string; kind: string }>
}

export function navigationTargetExists(
  pages: readonly NavigationProjectPage[],
  target: NavigationTarget,
) {
  const page = pages.find((candidate) => candidate.id === target.pageId)

  if (!page) {
    return false
  }

  if (target.type === 'page') {
    return true
  }

  return page.elements.some(
    (element) => element.id === target.elementId && element.kind === 'section',
  )
}

export function hasValidNavigationReferences(
  navigation: WebsiteNavigation,
  pages: readonly NavigationProjectPage[],
) {
  return navigation.items.every((item) => navigationTargetExists(pages, item.target))
}

export function pruneDanglingNavigationItems(
  navigation: WebsiteNavigation,
  pages: readonly NavigationProjectPage[],
): WebsiteNavigation {
  const remaining = navigation.items.filter((item) =>
    navigationTargetExists(pages, item.target),
  )
  const topLevelIds = new Set(remaining.filter((item) => !item.parentId).map((item) => item.id))
  const items = remaining.map((item) => item.parentId && !topLevelIds.has(item.parentId)
    ? { id: item.id, label: item.label, target: item.target } : item)

  return items.every((item, index) => item === navigation.items[index]) &&
    items.length === navigation.items.length ? navigation : { items }
}
