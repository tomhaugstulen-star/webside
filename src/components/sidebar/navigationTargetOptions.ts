import type { EditorPage } from '../../model/editorProject'
import type { NavigationTarget } from '../../model/navigation'

export type NavigationTargetOption = {
  value: string
  label: string
  target: NavigationTarget
}

export function navigationTargetValue(target: NavigationTarget) {
  return target.type === 'page'
    ? `page:${target.pageId}`
    : `section:${target.pageId}:${target.elementId}`
}

export function createNavigationTargetOptions(
  pages: readonly EditorPage[],
): NavigationTargetOption[] {
  return pages.flatMap((page) => {
    const pageOption: NavigationTargetOption = {
      value: `page:${page.id}`,
      label: `Side: ${page.name}`,
      target: { type: 'page', pageId: page.id },
    }
    const sectionOptions: NavigationTargetOption[] = page.elements
      .filter((element) => element.kind === 'section')
      .map((element) => ({
        value: `section:${page.id}:${element.id}`,
        label: `${page.name} → #${element.anchorId}`,
        target: {
          type: 'section',
          pageId: page.id,
          elementId: element.id,
        },
      }))

    return [pageOption, ...sectionOptions]
  })
}
