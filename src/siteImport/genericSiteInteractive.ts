import { DEFAULT_BUTTON_ASSET_ID } from '../model/buttonAsset'
import { createEditorElement } from '../model/createEditorElement'
import { createStableId } from '../model/createStableId'
import type { EditorElement } from '../model/editorProject'
import { normalizeExternalUrl, type ElementLink } from '../model/elementLink'
import { childBoxInContainer } from './genericSiteLayout'

type CssMap = Map<string, string>

export function externalElementLink(node: Element): ElementLink {
  if (!(node instanceof HTMLAnchorElement)) return { type: 'none' }
  const url = normalizeExternalUrl(node.href)
  if (!url) return { type: 'none' }
  return {
    type: 'external-url',
    url,
    openInNewTab: node.target === '_blank',
  }
}

export function isButtonLike(node: Element, css: CssMap) {
  if (node instanceof HTMLButtonElement) return true
  if (!(node instanceof HTMLAnchorElement)) return false
  const classes = node.className.toString().toLowerCase()
  if (/\b(?:btn|button|cta)(?:\b|[-_])/.test(classes)) return true
  return css.has('background') || css.has('background-color') ||
    css.has('border-radius')
}

export function createImportedButton(
  node: Element,
  css: CssMap,
  parentCss: CssMap,
  siblingIndex: number,
  fallbackY: number,
  existing: EditorElement[],
) {
  const label = node.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120)
  if (!label) return null
  const element = createEditorElement({
    id: createStableId(),
    request: { kind: 'button', assetId: DEFAULT_BUTTON_ASSET_ID },
    existingElements: existing,
  })
  if (element.kind !== 'button') return null
  const box = childBoxInContainer(css, parentCss, siblingIndex, fallbackY, {
    width: 180,
    height: 48,
  })
  return {
    ...element,
    label,
    link: externalElementLink(node),
    position: { desktop: { x: box.x, y: box.y } },
    size: { desktop: { width: box.width, height: box.height } },
  }
}
