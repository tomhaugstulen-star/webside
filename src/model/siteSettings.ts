export type SiteSettings = { language: string; publicUrl: string }
export type PageSeo = { title: string; description: string }

export const DEFAULT_SITE_SETTINGS: SiteSettings = { language: 'nb', publicUrl: '' }

export function normalizePublicUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || trimmed.length > 300 ||
      /%2f|%5c/i.test(url.pathname)) return null
    return url.origin + (url.pathname === '/' ? '/' : `${url.pathname.replace(/\/+$/, '')}/`)
  } catch { return null }
}

export function isValidSiteSettings(value: unknown): value is SiteSettings {
  if (!value || typeof value !== 'object') return false
  const data = value as SiteSettings
  return Object.keys(data).length === 2 && ['nb', 'en'].includes(data.language) &&
    typeof data.publicUrl === 'string' && normalizePublicUrl(data.publicUrl) === data.publicUrl
}

export function isValidPageSeo(value: unknown): value is PageSeo {
  if (!value || typeof value !== 'object') return false
  const data = value as PageSeo
  return Object.keys(data).length === 2 && typeof data.title === 'string' &&
    data.title.length <= 120 && typeof data.description === 'string' &&
    data.description.length <= 320
}
