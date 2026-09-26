import { PUBLIC_DESKTOP_WIDTH } from '../export/siteDimensions'
import type { ImportedBox } from './genericSiteLayout'
import { resolveSitePath } from './genericSitePaths'

const LAYOUT_ATTRIBUTE = 'data-webside-layout-id'

export type CapturedSiteLayout = {
  box: ImportedBox
  css: Map<string, string>
}

export type CapturedSiteLayouts = Map<string, CapturedSiteLayout>

type SiteAsset = { file: File }

const capturedProperties = [
  'background',
  'background-color',
  'background-image',
  'border-radius',
  'color',
  'display',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'line-height',
  'text-align',
] as const

export function capturedLayoutFor(
  element: Element,
  layouts: CapturedSiteLayouts,
) {
  const id = element.getAttribute(LAYOUT_ATTRIBUTE)
  return id ? layouts.get(id) ?? null : null
}

function assignLayoutIds(document: Document) {
  let id = 0
  for (const element of document.body.querySelectorAll('*')) {
    id += 1
    element.setAttribute(LAYOUT_ATTRIBUTE, String(id))
  }
}

function sanitizeClone(
  source: Document,
  htmlPath: string,
  cssText: string,
  assetsByPath: ReadonlyMap<string, SiteAsset>,
) {
  const clone = new DOMParser().parseFromString(
    '<!doctype html>' + source.documentElement.outerHTML,
    'text/html',
  )
  clone.querySelectorAll('script,iframe,object,embed,base,meta[http-equiv="refresh"]')
    .forEach((node) => node.remove())
  clone.querySelectorAll('style,link[rel~="stylesheet"]').forEach((node) => node.remove())

  const urls: string[] = []
  for (const image of clone.querySelectorAll('img[src]')) {
    const path = resolveSitePath(htmlPath, image.getAttribute('src') ?? '')
    const asset = path ? assetsByPath.get(path) : null
    if (!asset) {
      image.removeAttribute('src')
      continue
    }
    const url = URL.createObjectURL(asset.file)
    urls.push(url)
    image.setAttribute('src', url)
  }

  const style = clone.createElement('style')
  style.textContent = cssText
  clone.head.append(style)
  return { clone, urls }
}

function numeric(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0
}

export async function captureSiteLayouts(
  source: Document,
  htmlPath: string,
  cssText: string,
  assetsByPath: ReadonlyMap<string, SiteAsset>,
): Promise<CapturedSiteLayouts> {
  assignLayoutIds(source)
  const { clone, urls } = sanitizeClone(source, htmlPath, cssText, assetsByPath)
  const frame = globalThis.document.createElement('iframe')
  frame.setAttribute('sandbox', 'allow-same-origin')
  frame.setAttribute('aria-hidden', 'true')
  Object.assign(frame.style, {
    position: 'fixed',
    left: '-20000px',
    top: '0',
    width: `${PUBLIC_DESKTOP_WIDTH}px`,
    height: '30000px',
    border: '0',
    visibility: 'hidden',
    pointerEvents: 'none',
  })
  globalThis.document.body.append(frame)

  try {
    const loaded = new Promise<void>((resolve) => {
      frame.addEventListener('load', () => resolve(), { once: true })
    })
    frame.srcdoc = '<!doctype html>' + clone.documentElement.outerHTML
    await loaded

    const document = frame.contentDocument
    const view = frame.contentWindow
    if (!document || !view) return new Map()

    await Promise.all([...document.images].map(async (image) => {
      try {
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true })
            image.addEventListener('error', () => resolve(), { once: true })
          })
        }
        await image.decode().catch(() => undefined)
      } catch {
        // Broken or unsupported images should not abort the whole import.
      }
    }))
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )


    const view = frame.contentWindow
    if (!document || !view) return new Map()

    const layouts: CapturedSiteLayouts = new Map()
    for (const element of document.querySelectorAll(`[${LAYOUT_ATTRIBUTE}]`)) {
      const id = element.getAttribute(LAYOUT_ATTRIBUTE)
      if (!id) continue
      const rect = element.getBoundingClientRect()
      const computed = view.getComputedStyle(element)
      const css = new Map<string, string>()
      for (const property of capturedProperties) {
        css.set(property, computed.getPropertyValue(property))
      }
      layouts.set(id, {
        box: {
          x: numeric(rect.left),
          y: numeric(rect.top),
          width: Math.max(1, numeric(rect.width)),
          height: Math.max(1, numeric(rect.height)),
        },
        css,
      })
    }
    return layouts
  } finally {
    frame.remove()
    urls.forEach((url) => URL.revokeObjectURL(url))
  }
}
