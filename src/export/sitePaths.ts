export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function pageFilePath(slug: string) {
  return slug === '/' ? 'index.html' : `${slug.slice(1)}/index.html`
}

export function relativeRoot(slug: string) { return slug === '/' ? '' : '../' }

export function relativePageHref(currentSlug: string, target: string) {
  const [slug, anchor] = target.split('#')
  if (slug === currentSlug && anchor) return `#${anchor}`
  const path = slug === '/' ? '' : `${slug.slice(1)}/`
  return `${relativeRoot(currentSlug)}${path || './'}${anchor ? `#${anchor}` : ''}`
}
