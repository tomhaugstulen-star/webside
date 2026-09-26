import { createEditorElement } from '../model/createEditorElement'
import { createStableId } from '../model/createStableId'
import type { EditorPage } from '../model/editorProject'
import { createUniqueSectionAnchorId } from '../model/siteStructure'
import {
  collectCssForElement,
  cssBackgroundFillFromMap,
  cssPixel,
} from './genericSiteCss'
import {
  capturedLayoutFor,
  type CapturedSiteLayouts,
} from './genericSiteComputedLayout'
import { importedBox } from './genericSiteLayout'

export function addSemanticSections(
  page: EditorPage,
  document: Document,
  cssText: string,
  layouts: CapturedSiteLayouts,
) {
  let fallbackY = 20
  for (const container of document.body.querySelectorAll(
    ':scope > section, :scope > article, :scope > main, :scope > header, :scope > footer',
  )) {
    if (container.hasAttribute('data-webside-import-special')) continue
    const captured = capturedLayoutFor(container, layouts)
    const capturedMobile = capturedLayoutFor(container, layouts, 'mobile')
    const css = captured?.css ?? collectCssForElement(container, cssText)
    const background = cssBackgroundFillFromMap(css)
    const explicitHeight = cssPixel(css.get('height'))
    if (!background && explicitHeight === null) continue

    const element = createEditorElement({
      id: createStableId(),
      request: { kind: 'section' },
      existingElements: page.elements,
    })
    if (element.kind !== 'section') continue

    const box = captured?.box ?? importedBox(css, {
      x: 40,
      y: fallbackY,
      width: 1240,
      height: explicitHeight ?? 320,
    })
    const anchorId = createUniqueSectionAnchorId(
      page.elements
        .filter((candidate) => candidate.kind === 'section')
        .map((candidate) => candidate.kind === 'section' ? candidate.anchorId : ''),
      container.id || 'seksjon',
    )
    page.elements.push({
      ...element,
      anchorId,
      displayName: container.id
        ? `Seksjon: ${container.id}`
        : `Seksjon: ${container.tagName.toLowerCase()}`,
      position: {
        desktop: { x: box.x, y: box.y },
        mobile: capturedMobile
          ? { x: capturedMobile.box.x, y: capturedMobile.box.y }
          : undefined,
      },
      size: {
        desktop: {
          width: Math.max(160, box.width),
          height: Math.max(90, box.height),
        },
        mobile: capturedMobile
          ? {
              width: Math.max(160, capturedMobile.box.width),
              height: Math.max(90, capturedMobile.box.height),
            }
          : undefined,
      },
      appearance: background
        ? { ...element.appearance, backgroundFill: background }
        : element.appearance,
    })
    fallbackY = Math.max(fallbackY, box.y + box.height + 20)
  }
}
