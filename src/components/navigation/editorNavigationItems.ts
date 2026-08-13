import type {
  EditorElement,
  EditorPage,
  ElementKind,
} from '../../model/editorProject'

export type NavigatorKindFilter = 'all' | ElementKind
export type NavigatorStatusFilter =
  | 'all'
  | 'visible'
  | 'hidden'
  | 'locked'
  | 'unlocked'

export const navigatorKindLabels: Record<ElementKind, string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
  header: 'Header',
}

function getKindOrdinal(page: EditorPage, elementIndex: number) {
  const element = page.elements[elementIndex]

  return page.elements
    .slice(0, elementIndex + 1)
    .filter((candidate) => candidate.kind === element.kind).length
}

export function getNavigatorElementName(
  page: EditorPage,
  element: EditorElement,
  elementIndex: number,
) {
  switch (element.kind) {
    case 'text': {
      const content = element.content.trim().replace(/\s+/g, ' ')
      return content ? content.slice(0, 32) : 'Tom tekstboks'
    }
    case 'button':
      return element.label.trim() || 'Knapp'
    case 'image':
      return element.assetMetadata.fileName
    case 'header':
      return element.siteName.trim() || 'Header'
    case 'section':
      return `Seksjon ${getKindOrdinal(page, elementIndex)}`
  }
}

function getViewportVisibility(element: EditorElement) {
  const desktop = element.visibility.desktop
  const mobile = element.visibility.mobile ?? desktop

  return { desktop, mobile }
}

export function getNavigatorVisibilityLabel(element: EditorElement) {
  const { desktop, mobile } = getViewportVisibility(element)

  if (!desktop && !mobile) {
    return 'Skjult'
  }

  if (desktop && !mobile) {
    return 'Skjult på telefon'
  }

  if (!desktop && mobile) {
    return 'Skjult på PC'
  }

  return 'Synlig'
}

export function matchesNavigatorFilters(
  element: EditorElement,
  kindFilter: NavigatorKindFilter,
  statusFilter: NavigatorStatusFilter,
) {
  if (kindFilter !== 'all' && element.kind !== kindFilter) {
    return false
  }

  const { desktop, mobile } = getViewportVisibility(element)

  switch (statusFilter) {
    case 'visible':
      return desktop && mobile
    case 'hidden':
      return !desktop || !mobile
    case 'locked':
      return element.locked
    case 'unlocked':
      return !element.locked
    case 'all':
      return true
  }
}
