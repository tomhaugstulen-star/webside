export type RuntimeContent = Record<string, string>

function isRuntimeContent(value: unknown): value is RuntimeContent {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === 'string')
  )
}

export function parseRuntimeContent(bytes: Uint8Array | undefined) {
  if (!bytes) return null
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes))
    return isRuntimeContent(parsed) ? parsed : null
  } catch {
    return null
  }
}

function safeLocalPath(value: string | undefined) {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.includes('..') || /^(?:[a-z]+:|\/\/|\/)/i.test(trimmed)) {
    return null
  }
  return trimmed
}

function appendInlineStyle(element: Element, declaration: string) {
  const current = element.getAttribute('style')?.trim()
  element.setAttribute('style', current ? `${current};${declaration}` : declaration)
}

function applyFontHints(document: Document, content: RuntimeContent) {
  const heading = content['style.headingFont']
  const body = content['style.bodyFont']
  const headingFamily = heading === 'serif'
    ? 'Georgia'
    : heading === 'classic'
      ? 'Georgia'
      : heading === 'clean' || heading === 'modern'
        ? 'Arial'
        : null
  const bodyFamily = body === 'serif'
    ? 'Georgia'
    : body === 'clean'
      ? 'Arial'
      : body === 'humanist'
        ? 'Trebuchet MS'
        : body === 'system'
          ? 'system-ui'
          : null

  if (bodyFamily) appendInlineStyle(document.body, `font-family:${bodyFamily}`)
  if (headingFamily) {
    for (const headingNode of document.querySelectorAll('h1,h2,h3')) {
      appendInlineStyle(headingNode, `font-family:${headingFamily}`)
    }
  }
}

function applyLayoutHints(document: Document, content: RuntimeContent) {
  const hero = document.querySelector('.hero,[class*="hero"],[id*="hero"]')
  const heroX = Number.parseInt(content['layout.heroX'] ?? '', 10)
  const heroY = Number.parseInt(content['layout.heroY'] ?? '', 10)
  if (hero && (Number.isFinite(heroX) || Number.isFinite(heroY))) {
    const x = Number.isFinite(heroX) ? heroX : 0
    const y = Number.isFinite(heroY) ? heroY : 0
    hero.setAttribute('data-webside-runtime-offset-x', String(x))
    hero.setAttribute('data-webside-runtime-offset-y', String(y))
  }

  const ctaOffsets = [
    ['1', 'layout.cta1Y'],
    ['2', 'layout.cta2Y'],
    ['3', 'layout.cta3Y'],
  ] as const
  for (const [slot, key] of ctaOffsets) {
    const value = Number.parseInt(content[key] ?? '', 10)
    if (!Number.isFinite(value)) continue
    const target = document.querySelector(`[data-cta-slot="${slot}"]`)
    if (target) appendInlineStyle(target, `margin-top:${value}px`)
  }
}

export function applyRuntimeContent(
  document: Document,
  content: RuntimeContent | null,
) {
  if (!content) return

  for (const element of document.querySelectorAll('[data-content]')) {
    const key = element.getAttribute('data-content')
    if (key && Object.hasOwn(content, key)) element.textContent = content[key]
  }

  for (const element of document.querySelectorAll('[data-href-key]')) {
    const key = element.getAttribute('data-href-key')
    const href = key ? safeLocalPath(content[key]) : null
    if (href) element.setAttribute('href', href)
  }

  for (const image of document.querySelectorAll('img[data-image-key]')) {
    const key = image.getAttribute('data-image-key')
    const src = key ? safeLocalPath(content[key]) : null
    if (src) image.setAttribute('src', src)
  }

  for (const container of document.querySelectorAll('[data-image-container]')) {
    const key = container.getAttribute('data-image-container')
    const src = key ? safeLocalPath(content[key]) : null
    if (src) container.removeAttribute('hidden')
    else container.setAttribute('hidden', '')
  }

  const heroImage = safeLocalPath(content['image.hero'])
  const hero = document.querySelector('.hero,[class*="hero"],[id*="hero"]')
  if (hero && heroImage) hero.setAttribute('data-webside-runtime-hero-image', heroImage)

  applyFontHints(document, content)
  applyLayoutHints(document, content)
}
