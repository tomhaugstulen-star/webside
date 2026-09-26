import { createEditorElement } from '../model/createEditorElement'
import { createStableId } from '../model/createStableId'
import type { EditorPage } from '../model/editorProject'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'
import { DEFAULT_TEXT_ELEMENT_STYLE } from '../model/textElementStyle'
import {
  applyCssTextStyle,
  collectCssForElement,
  cssBackgroundFill,
} from './genericSiteCss'
import { externalElementLink } from './genericSiteInteractive'
import { importedBox } from './genericSiteLayout'
import { resolveSitePath } from './genericSitePaths'

type SiteAsset = {
  assetId: ImageAssetId
  metadata: ImageAssetMetadata
}

const SPECIAL_ATTRIBUTE = 'data-webside-import-special'

function assetForPath(
  htmlPath: string,
  reference: string,
  assetsByPath: ReadonlyMap<string, SiteAsset>,
) {
  const path = resolveSitePath(htmlPath, reference)
  return path ? assetsByPath.get(path) ?? null : null
}

function backgroundImageReference(value: string | undefined) {
  return value?.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i)?.[1] ?? null
}

function assetForHero(
  container: Element,
  css: Map<string, string>,
  htmlPath: string,
  assetsByPath: ReadonlyMap<string, SiteAsset>,
) {
  const image = container.querySelector('img[src]')
  if (image) {
    const asset = assetForPath(htmlPath, image.getAttribute('src') ?? '', assetsByPath)
    if (asset) return asset
  }
  const reference = backgroundImageReference(css.get('background-image') ?? css.get('background'))
  return reference ? assetForPath(htmlPath, reference, assetsByPath) : null
}

function importHeader(
  page: EditorPage,
  document: Document,
  cssText: string,
  htmlPath: string,
  assetsByPath: ReadonlyMap<string, SiteAsset>,
) {
  const header = document.querySelector('header')
  const logo = header?.querySelector('img[src]')
  if (!header || !logo) return
  const asset = assetForPath(htmlPath, logo.getAttribute('src') ?? '', assetsByPath)
  if (!asset) return

  const nameNode = header.querySelector('[class*="site-name"],[class*="brand"],strong,h1,h2')
  const subtitleNode = header.querySelector('[class*="subtitle"],small,p')
  const siteName = nameNode?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) || 'Nettsted'
  const subtitle = subtitleNode?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 180) || ''
  const element = createEditorElement({
    id: createStableId(),
    request: {
      kind: 'header',
      logoAssetId: asset.assetId,
      logoAssetMetadata: asset.metadata,
      siteName,
      subtitle,
    },
    existingElements: page.elements,
  })
  if (element.kind !== 'header') return

  const css = collectCssForElement(header, cssText)
  const nameCss = nameNode ? collectCssForElement(nameNode, cssText) : css
  const style = applyCssTextStyle(DEFAULT_TEXT_ELEMENT_STYLE, nameCss)
  const box = importedBox(css, { x: 0, y: 0, width: 960, height: 88 })
  const fill = cssBackgroundFill(css.get('background') ?? css.get('background-color'))
  page.elements.push({
    ...element,
    position: { desktop: { x: box.x, y: box.y } },
    size: {
      desktop: {
        width: Math.max(240, box.width),
        height: Math.max(70, Math.min(100, box.height)),
      },
    },
    appearance: {
      ...element.appearance,
      backgroundFill: fill ?? element.appearance.backgroundFill,
      textColor: style.color,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
    },
  })
  header.setAttribute(SPECIAL_ATTRIBUTE, 'header')
}

function heroCandidate(document: Document) {
  return document.querySelector(
    'section.hero,section[class*="hero"],section[id*="hero"],' +
    'div.hero,div[class*="hero"],div[id*="hero"],' +
    'section[class*="banner"],div[class*="banner"]',
  )
}

function importHero(
  page: EditorPage,
  document: Document,
  cssText: string,
  htmlPath: string,
  assetsByPath: ReadonlyMap<string, SiteAsset>,
) {
  const hero = heroCandidate(document)
  if (!hero) return
  const css = collectCssForElement(hero, cssText)
  const asset = assetForHero(hero, css, htmlPath, assetsByPath)
  if (!asset) return

  const titleNode = hero.querySelector('h1,h2')
  const subtitleNode = hero.querySelector('p,[class*="subtitle"]')
  const ctaNode = hero.querySelector('a[href],button')
  const element = createEditorElement({
    id: createStableId(),
    request: {
      kind: 'hero',
      imageAssetId: asset.assetId,
      imageAssetMetadata: asset.metadata,
    },
    existingElements: page.elements,
  })
  if (element.kind !== 'hero') return

  const title = titleNode?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 180) || 'Overskrift'
  const subtitle = subtitleNode?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 300) || ''
  const ctaLabel = ctaNode?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) || ''
  const titleCss = titleNode ? collectCssForElement(titleNode, cssText) : css
  const style = applyCssTextStyle(DEFAULT_TEXT_ELEMENT_STYLE, titleCss)
  const fill = cssBackgroundFill(css.get('background') ?? css.get('background-color'))
  const box = importedBox(css, { x: 80, y: 140, width: 1160, height: 420 })

  page.elements.push({
    ...element,
    title,
    subtitle,
    ctaLabel,
    ctaLink: ctaNode ? externalElementLink(ctaNode) : element.ctaLink,
    position: { desktop: { x: box.x, y: box.y } },
    size: {
      desktop: {
        width: Math.max(280, box.width),
        height: Math.max(160, box.height),
      },
    },
    appearance: {
      ...element.appearance,
      backgroundFill: fill ?? element.appearance.backgroundFill,
      textColor: style.color,
    },
  })
  hero.setAttribute(SPECIAL_ATTRIBUTE, 'hero')
}

export function addSpecialImportedElements(
  page: EditorPage,
  document: Document,
  cssText: string,
  htmlPath: string,
  assetsByPath: ReadonlyMap<string, SiteAsset>,
) {
  importHeader(page, document, cssText, htmlPath, assetsByPath)
  importHero(page, document, cssText, htmlPath, assetsByPath)
}

export function isInsideSpecialImportedElement(node: Element) {
  return Boolean(node.closest(`[${SPECIAL_ATTRIBUTE}]`))
}
