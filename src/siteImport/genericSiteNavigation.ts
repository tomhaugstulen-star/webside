import { createStableId } from '../model/createStableId'
import type { EditorProject } from '../model/editorProject'
import type { NavigationItem } from '../model/navigation'
import { normalizeNavigationLabel } from '../model/navigation'
import { normalizeSectionAnchorId } from '../model/siteStructure'
import { htmlPathToSlug, resolveSitePath } from './genericSitePaths'

function hrefTargetSlug(htmlPath: string, href: string) {
  const raw = href.trim()
  if (!raw || /^(?:mailto:|tel:|javascript:|https?:|\/\/)/i.test(raw)) return null
  const [pathPart, hash = ''] = raw.split('#')
  const currentSlug = htmlPathToSlug(htmlPath)
  if (!currentSlug) return null

  let slug = currentSlug
  if (pathPart) {
    if (pathPart === '/') slug = '/'
    else if (pathPart.startsWith('/')) {
      const clean = pathPart.replace(/^\/+|\/+$/g, '')
      slug = clean ? '/' + clean.replace(/\.html$/i, '') : '/'
    } else {
      const resolved = resolveSitePath(htmlPath, pathPart)
      if (!resolved) return null
      slug = htmlPathToSlug(resolved) ??
        '/' + resolved.replace(/\/index\.html$/i, '').replace(/\.html$/i, '').replace(/\/+$/g, '')
    }
  }

  return { slug: slug === '' ? '/' : slug, hash }
}

function targetForHref(project: EditorProject, htmlPath: string, href: string) {
  const parsed = hrefTargetSlug(htmlPath, href)
  if (!parsed) return null
  const page = project.pages.find((candidate) => candidate.slug === parsed.slug)
  if (!page) return null

  if (parsed.hash) {
    const anchor = normalizeSectionAnchorId(parsed.hash)
    const section = anchor
      ? page.elements.find((element) =>
          element.kind === 'section' && element.anchorId === anchor,
        )
      : null
    if (section) {
      return { type: 'section' as const, pageId: page.id, elementId: section.id }
    }
  }

  return { type: 'page' as const, pageId: page.id }
}

export function importNavigation(
  project: EditorProject,
  htmlPages: Array<{ path: string; document: Document }>,
) {
  const items: NavigationItem[] = []
  const seen = new Set<string>()

  for (const { path, document } of htmlPages) {
    for (const nav of document.querySelectorAll('nav')) {
      for (const anchor of nav.querySelectorAll('a[href]')) {
        const label = normalizeNavigationLabel(anchor.textContent ?? '')
        if (!label || label.length > 80) continue
        const href = anchor.getAttribute('href') ?? ''
        const target = targetForHref(project, path, href)
        if (!target) continue
        const key = `${label}|${target.type}|${target.pageId}|${'elementId' in target ? target.elementId : ''}`
        if (seen.has(key)) continue
        seen.add(key)
        items.push({ id: createStableId(), label, target })
      }
    }
  }

  project.navigation = { items }
}
