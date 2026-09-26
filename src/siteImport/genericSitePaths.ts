export function htmlPathToSlug(path: string) {
  if (path === 'index.html') return '/'
  if (path.endsWith('/index.html')) return '/' + path.slice(0, -'/index.html'.length)
  if (path.endsWith('.html')) return '/' + path.slice(0, -'.html'.length)
  return null
}

export function resolveSitePath(htmlPath: string, reference: string) {
  const clean = reference.split('#')[0].split('?')[0]
  if (!clean || /^(?:[a-z]+:|\/\/|data:)/i.test(clean)) return null
  if (clean.startsWith('/')) return clean.slice(1)

  const base = htmlPath.includes('/')
    ? htmlPath.slice(0, htmlPath.lastIndexOf('/') + 1)
    : ''
  const parts = (base + clean).split('/')
  const normalized: string[] = []

  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') normalized.pop()
    else normalized.push(part)
  }

  return normalized.join('/')
}
