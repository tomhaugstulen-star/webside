import { createEditorElement } from '../model/createEditorElement'
import { createStableId } from '../model/createStableId'
import type { EditorPage } from '../model/editorProject'
import { collectCssForElement, cssBackgroundFill, cssPixel } from './genericSiteCss'
import { importedBox } from './genericSiteLayout'

export function addSemanticSections(
  page: EditorPage,
  document: Document,
  cssText: string,
) {
  let fallbackY = 20
  for (const container of document.body.querySelectorAll(
    ':scope > section, :scope > article, :scope > main, :scope > header, :scope > footer',
  )) {
    const css = collectCssForElement(container, cssText)
    const background = cssBackgroundFill(
      css.get('background') ?? css.get('background-color'),
    )
    const explicitHeight = cssPixel(css.get('height'))
    if (!background && explicitHeight === null) continue

    const element = createEditorElement({
      id: createStableId(),
      request: { kind: 'section' },
      existingElements: page.elements,
    })
    if (element.kind !== 'section') continue

    const box = importedBox(css, {
      x: 40,
      y: fallbackY,
      width: 1240,
      height: explicitHeight ?? 320,
    })
    page.elements.push({
      ...element,
      displayName: container.id
        ? `Seksjon: ${container.id}`
        : `Seksjon: ${container.tagName.toLowerCase()}`,
      position: { desktop: { x: box.x, y: box.y } },
      size: { desktop: { width: box.width, height: box.height } },
      appearance: background
        ? { ...element.appearance, backgroundFill: background }
        : element.appearance,
    })
    fallbackY = Math.max(fallbackY, box.y + box.height + 20)
  }
}
