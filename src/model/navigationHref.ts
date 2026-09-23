import type { NavigationTarget } from './navigation'

type NavigationHrefElement = {
  id: string
  kind: string
  anchorId?: unknown
}

type NavigationHrefPage = {
  id: string
  slug: string
  elements: NavigationHrefElement[]
}

export function resolveNavigationTargetHref(
  pages: readonly NavigationHrefPage[],
  target: NavigationTarget,
): string | null {
  const page = pages.find((candidate) => candidate.id === target.pageId)

  if (!page) {
    return null
  }

  if (target.type === 'page') {
    return page.slug
  }

  const section = page.elements.find(
    (element) => element.id === target.elementId && element.kind === 'section',
  )

  return section && typeof section.anchorId === 'string'
    ? `${page.slug}#${section.anchorId}`
    : null
}
