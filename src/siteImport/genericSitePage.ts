import { createEditorPage } from '../model/createEditorProject'
import { createEditorElement } from '../model/createEditorElement'
import { createStableId } from '../model/createStableId'
import type { EditorElement, EditorPage } from '../model/editorProject'
import type { ImageAssetId } from '../model/imageAsset'
import { DEFAULT_TEXT_ELEMENT_STYLE, type TextFontSize } from '../model/textElementStyle'
import type { ImportedProjectFile } from '../projectFiles/projectFileFormat'
import {
  applyCssTextStyle,
  collectCssForElement,
  cssBackgroundFillFromMap,
  cssPixel,
} from './genericSiteCss'
import {
  createImportedButton,
  externalElementLink,
  isButtonLike,
} from './genericSiteInteractive'
import {
  captureSiteLayouts,
  capturedLayoutFor,
  type CapturedSiteLayout,
} from './genericSiteComputedLayout'
import { childBoxInContainer } from './genericSiteLayout'
import { importedTextBoxHeight } from './genericSiteTextLayout'
import { htmlPathToSlug, resolveSitePath } from './genericSitePaths'
import { addSemanticSections } from './genericSiteSections'
import {
  addSpecialImportedElements,
  isInsideSpecialImportedElement,
} from './genericSiteSpecialElements'
import {
  applyRuntimeContent,
  type RuntimeContent,
} from './genericSiteRuntimeContent'

export type AssetMapEntry = {
  assetId: ImageAssetId
  metadata: ImportedProjectFile['assets'][number]['metadata']
  file: File
}

function pageName(document: Document, slug: string) {
  const title = document.querySelector('title')?.textContent?.trim()
  if (title) return title.slice(0, 80)
  if (slug === '/') return 'Forside'
  return slug.slice(1).split('/').filter(Boolean).at(-1)?.replace(/[-_]+/g, ' ') || 'Side'
}

function headingSize(tagName: string): TextFontSize {
  if (tagName === 'H1') return 48
  if (tagName === 'H2') return 36
  if (tagName === 'H3') return 28
  return 16
}

function makeTextElement(
  content: string,
  tagName: string,
  y: number,
  existing: EditorElement[],
  css: Map<string, string>,
  parentCss: Map<string, string>,
  siblingIndex: number,
  link: ReturnType<typeof externalElementLink>,
  captured: CapturedSiteLayout | null,
) {
  const element = createEditorElement({
    id: createStableId(),
    request: { kind: 'text' },
    existingElements: existing,
  })
  if (element.kind !== 'text') throw new Error('Kunne ikke opprette tekst.')
  const fontSize = headingSize(tagName)
  const baseStyle = {
    ...DEFAULT_TEXT_ELEMENT_STYLE,
    fontSize,
    fontWeight: tagName.startsWith('H') ? 'bold' as const : 'normal' as const,
  }
  const measured = captured?.box
  const box = measured ?? childBoxInContainer(css, parentCss, siblingIndex, y, {
    width: 760,
    height: Math.max(64, Math.round(fontSize * 2.2)),
  })
  const background = cssBackgroundFillFromMap(css)
  return {
    ...element,
    content,
    position: { desktop: { x: box.x, y: box.y } },
    size: {
      desktop: {
        width: Math.max(120, box.width),
        height: importedTextBoxHeight(box.height),
      },
    },
    appearance: background
      ? { ...element.appearance, backgroundFill: background }
      : element.appearance,
    textStyle: applyCssTextStyle(baseStyle, css),
    link,
  }
}

export async function createPageFromHtml(
  htmlPath: string,
  html: string,
  assetsByPath: Map<string, AssetMapEntry>,
  filesByPath: Map<string, Uint8Array>,
  runtimeContent: RuntimeContent | null,
): Promise<EditorPage | null> {
  const slug = htmlPathToSlug(htmlPath)
  if (!slug) return null
  const document = new DOMParser().parseFromString(html, 'text/html')
  applyRuntimeContent(document, runtimeContent)
  const page = createEditorPage(createStableId(), pageName(document, slug), slug)
  const cssParts = [...document.querySelectorAll('style')]
    .map((style) => style.textContent || '')
  for (const link of document.querySelectorAll('link[rel~="stylesheet"]')) {
    const path = resolveSitePath(htmlPath, link.getAttribute('href') || '')
    const bytes = path ? filesByPath.get(path) : null
    if (bytes) cssParts.push(new TextDecoder().decode(bytes))
  }
  const cssText = cssParts.join('\n')
  const layouts = await captureSiteLayouts(document, htmlPath, cssText, assetsByPath)
  const bodyCss = collectCssForElement(document.body, cssText)
  const pageBackground = cssBackgroundFillFromMap(bodyCss)
  if (pageBackground) page.appearance = { backgroundFill: pageBackground }
  addSpecialImportedElements(
    page, document, cssText, htmlPath, assetsByPath, layouts,
  )
  addSemanticSections(page, document, cssText, layouts)
  page.seo = {
    title: document.querySelector('title')?.textContent?.trim().slice(0, 120) || page.name,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim().slice(0, 300) || '',
  }

  let y = 60
  const candidates = [...document.body.querySelectorAll('h1,h2,h3,p,li,a,button,img')]
  for (const node of candidates) {
    if (node.closest('nav') || isInsideSpecialImportedElement(node)) continue
    if (node.parentElement?.closest('h1,h2,h3,p,li,a,button')) continue
    const captured = capturedLayoutFor(node, layouts)
    const css = captured?.css ?? collectCssForElement(node, cssText)
    const parent = node.parentElement
    const parentCaptured = parent ? capturedLayoutFor(parent, layouts) : null
    const parentCss = parentCaptured?.css ?? (parent
      ? collectCssForElement(parent, cssText)
      : new Map<string, string>())
    const siblings = parent
      ? [...parent.children].filter((child) => child.matches('h1,h2,h3,p,li,a,button,img'))
      : [node]
    parentCss.set('--import-child-count', String(siblings.length))
    const siblingIndex = Math.max(0, siblings.indexOf(node))

    if (isButtonLike(node, css)) {
      const button = createImportedButton(
        node, css, parentCss, siblingIndex, y, page.elements,
      )
      if (button) {
        const box = captured?.box
        page.elements.push(box ? {
          ...button,
          position: { desktop: { x: box.x, y: box.y } },
          size: {
            desktop: {
              width: Math.max(80, box.width),
              height: Math.max(36, box.height),
            },
          },
        } : button)
        if (cssPixel(css.get('top')) === null &&
          parentCss.get('display') !== 'flex' && parentCss.get('display') !== 'grid') {
          y += button.size.desktop.height + 20
        }
      }
      continue
    }

    if (node instanceof HTMLImageElement) {
      const path = resolveSitePath(htmlPath, node.getAttribute('src') || '')
      const asset = path ? assetsByPath.get(path) : null
      if (!asset) continue
      const element = createEditorElement({
        id: createStableId(),
        request: {
          kind: 'image',
          assetId: asset.assetId,
          assetMetadata: asset.metadata,
        },
        existingElements: page.elements,
      })
      if (element.kind !== 'image') continue
      const naturalWidth = Math.min(760, asset.metadata.width)
      const naturalHeight = Math.max(80,
        Math.round(asset.metadata.height * naturalWidth / asset.metadata.width))
      const box = captured?.box ?? childBoxInContainer(
        css, parentCss, siblingIndex, y, {
          width: naturalWidth,
          height: naturalHeight,
        },
      )
      page.elements.push({
        ...element,
        altText: node.getAttribute('alt')?.slice(0, 300) || '',
        position: { desktop: { x: box.x, y: box.y } },
        size: {
          desktop: {
            width: Math.max(48, box.width),
            height: Math.max(48, box.height),
          },
        },
      })
      if (cssPixel(css.get('top')) === null &&
        parentCss.get('display') !== 'flex' && parentCss.get('display') !== 'grid') {
        y += box.height + 28
      }
      continue
    }

    const text = node.textContent?.replace(/\s+/g, ' ').trim()
    if (!text) continue
    const element = makeTextElement(
      text.slice(0, 2000), node.tagName, y, page.elements,
      css, parentCss, siblingIndex, externalElementLink(node), captured,
    )
    page.elements.push(element)
    if (cssPixel(css.get('top')) === null &&
      parentCss.get('display') !== 'flex' && parentCss.get('display') !== 'grid') {
      y += element.size.desktop.height + 20
    }
  }

  return page
}
