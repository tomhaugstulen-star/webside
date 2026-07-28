export type NoElementLink = {
  type: 'none'
}

export type ExternalUrlElementLink = {
  type: 'external-url'
  url: string
  openInNewTab: boolean
}

export type ElementLink = NoElementLink | ExternalUrlElementLink

export const NO_ELEMENT_LINK: NoElementLink = {
  type: 'none',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasExactKeys(value: Record<string, unknown>, expectedKeys: readonly string[]) {
  const keys = Object.keys(value)

  return (
    keys.length === expectedKeys.length &&
    keys.every((key) => expectedKeys.includes(key))
  )
}

export function normalizeExternalUrl(value: string): string | null {
  const normalized = value.trim()

  if (!/^https?:\/\//i.test(normalized)) {
    return null
  }

  try {
    const parsed = new URL(normalized)

    if (
      (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') ||
      parsed.hostname.length === 0
    ) {
      return null
    }

    return normalized
  } catch {
    return null
  }
}

export function isValidElementLink(value: unknown): value is ElementLink {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return false
  }

  switch (value.type) {
    case 'none':
      return hasExactKeys(value, ['type'])
    case 'external-url':
      return (
        hasExactKeys(value, ['type', 'url', 'openInNewTab']) &&
        typeof value.url === 'string' &&
        normalizeExternalUrl(value.url) === value.url &&
        typeof value.openInNewTab === 'boolean'
      )
    default:
      return false
  }
}

export function elementLinksEqual(first: ElementLink, second: ElementLink) {
  if (first.type !== second.type) {
    return false
  }

  if (first.type === 'none' || second.type === 'none') {
    return true
  }

  return first.url === second.url && first.openInNewTab === second.openInNewTab
}
