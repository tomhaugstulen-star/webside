import { resolveSitePath } from './genericSitePaths'

function normalizedCssUrl(basePath: string, raw: string) {
  const value = raw.trim().replace(/^['"]|['"]$/g, '')
  if (!value) return 'data:,'
  if (/^data:/i.test(value)) return value
  if (/^(?:https?:|\/\/|javascript:)/i.test(value)) return 'data:,'
  const resolved = resolveSitePath(basePath, value)
  return resolved ? '/' + resolved : 'data:,'
}

function rewriteCssUrls(cssText: string, basePath: string) {
  return cssText.replace(/url\(\s*([^)]*?)\s*\)/gi, (_match, raw: string) =>
    `url("${normalizedCssUrl(basePath, raw)}")`,
  )
}

export function collectPageCss(
  document: Document,
  htmlPath: string,
  filesByPath: ReadonlyMap<string, Uint8Array>,
) {
  const decoder = new TextDecoder()
  const parts: string[] = []

  for (const node of document.querySelectorAll('style,link[rel~="stylesheet"]')) {
    if (node instanceof HTMLStyleElement) {
      parts.push(rewriteCssUrls(node.textContent ?? '', htmlPath))
      continue
    }

    const href = node.getAttribute('href') ?? ''
    const path = resolveSitePath(htmlPath, href)
    const bytes = path ? filesByPath.get(path) : null
    if (path && bytes) {
      parts.push(rewriteCssUrls(decoder.decode(bytes), path))
    }
  }

  return parts.join('\n')
}
