import type { EditorElement, EditorProject } from '../model/editorProject'
import { editorFillToCssBackground } from '../model/editorFill'
import { getImageRenderLayout } from '../model/imagePresentation'
import { resolveResponsiveElementLayout } from '../model/resolveResponsiveElementLayout'
import { resolveResponsiveValue } from '../model/resolveResponsiveValue'
import { getTextFontFamilyCssValue } from '../components/canvas/getTextElementCssStyle'
import type { ElementLink } from '../model/elementLink'
import { resolveNavigationTargetHref } from '../model/navigationHref'
import { escapeHtml, relativePageHref } from './sitePaths'

const property = (key: string, value: string | number) => `${key}:${value};`
const pixels = (n: number) => `${n}px`
const frameCss = (element: Extract<EditorElement, { appearance: unknown }>) =>
  `background:${editorFillToCssBackground(element.appearance.backgroundFill)};` +
  `border:${element.appearance.frame.width}px solid ${element.appearance.frame.color};`

function layoutCss(element: EditorElement) {
  const desktop = resolveResponsiveElementLayout(element, 'desktop', 1080)
  const mobile = resolveResponsiveElementLayout(element, 'mobile', 390)
  const vars = (prefix: string, layout: typeof desktop) =>
    property(`--${prefix}-x`, pixels(layout.position.x)) +
    property(`--${prefix}-y`, pixels(layout.position.y)) +
    property(`--${prefix}-w`, pixels(layout.size.width)) +
    property(`--${prefix}-h`, pixels(layout.size.height))
  return vars('d', desktop) + vars('m', mobile)
}

function linkContent(content: string, link: ElementLink) {
  if (link.type !== 'external-url') return content
  return `<a href="${escapeHtml(link.url)}"${link.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${content}</a>`
}

function imageMarkup(element: Extract<EditorElement, { kind: 'image' }>, asset: string) {
  const layout = (mode: 'desktop' | 'mobile', width: number) => {
    const frame = resolveResponsiveElementLayout(element, mode, width).size
    const image = getImageRenderLayout(element.assetMetadata, frame, element.mode, element.transform)
    const prefix = mode === 'desktop' ? 'd' : 'm'
    return `--${prefix}-ix:${image.left}px;--${prefix}-iy:${image.top}px;` +
      `--${prefix}-iw:${image.width}px;--${prefix}-ih:${image.height}px;`
  }
  return `<div class="site-image" style="${layout('desktop', 1080)}${layout('mobile', 390)}">` +
    `<img src="${escapeHtml(asset)}" alt="${escapeHtml(element.altText)}" loading="lazy"></div>`
}

function headerMarkup(element: Extract<EditorElement, { kind: 'header' }>, project: EditorProject,
  pageSlug: string, asset: string) {
  const items = project.navigation.items
  const navigation = items.filter((item) => !item.parentId).map((item) => {
    const href = resolveNavigationTargetHref(project.pages, item.target)
    if (!href) return ''
    const children = items.filter((child) => child.parentId === item.id).map((child) => {
      const childHref = resolveNavigationTargetHref(project.pages, child.target)
      return childHref ? `<a href="${escapeHtml(relativePageHref(pageSlug, childHref))}">${escapeHtml(child.label)}</a>` : ''
    }).join('')
    const current = item.target.type === 'page' && project.pages.find((p) => p.slug === pageSlug)?.id === item.target.pageId
    return `<div class="site-nav-group"><a href="${escapeHtml(relativePageHref(pageSlug, href))}"${current ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>` +
      (children ? `<button type="button" aria-label="Vis undermeny for ${escapeHtml(item.label)}" aria-expanded="false" class="site-submenu-toggle">▾</button><div class="site-submenu" hidden>${children}</div>` : '') + '</div>'
  }).join('')
  return `<div class="site-header-brand"><img src="${escapeHtml(asset)}" alt="" loading="eager"><div><strong>${escapeHtml(element.siteName)}</strong>` +
    (element.subtitle ? `<span>${escapeHtml(element.subtitle)}</span>` : '') + '</div></div>' +
    (navigation ? `<button type="button" class="site-menu-toggle" aria-expanded="false" aria-controls="site-nav">Meny</button><nav id="site-nav" aria-label="Nettstedmeny">${navigation}</nav>` : '')
}

export function renderPublicElements(project: EditorProject, pageSlug: string,
  assetHref: (id: string) => string, buttonHref: (id: string) => { href: string; color: string }) {
  const page = project.pages.find((candidate) => candidate.slug === pageSlug)
  if (!page) throw new Error('Siden finnes ikke.')
  return [...page.elements.filter((element) => element.kind === 'section'),
    ...page.elements.filter((element) => element.kind !== 'section')].map((element) => {
    const classes = `site-element site-${element.kind}` +
      (!element.visibility.desktop ? ' hide-desktop' : '') +
      (!resolveResponsiveValue(element.visibility, 'mobile') ? ' hide-mobile' : '')
    let style = layoutCss(element)
    if (element.kind === 'text') {
      const font = element.textStyle
      style += frameCss(element) + `font:${font.fontStyle} ${font.fontWeight} ${font.fontSize}px/${font.lineHeight} ${getTextFontFamilyCssValue(font.fontFamily)};color:${font.color};text-align:${font.textAlign};`
    } else if (element.kind === 'section' || element.kind === 'hero' || element.kind === 'header') {
      style += frameCss(element)
      if (element.kind === 'hero') style += `color:${element.appearance.textColor};`
      if (element.kind === 'header') style += `color:${element.appearance.textColor};font-family:${getTextFontFamilyCssValue(element.appearance.fontFamily)};font-size:${element.appearance.fontSize}px;`
    }
    let content = ''
    switch (element.kind) {
      case 'text': content = linkContent(`<span>${escapeHtml(element.content)}</span>`, element.link); break
      case 'image': content = imageMarkup(element, assetHref(element.assetId)); break
      case 'button': {
        const button = buttonHref(element.assetId)
        content = linkContent(`<span class="site-button-content" style="color:${button.color}"><img src="${escapeHtml(button.href)}" alt=""><span>${escapeHtml(element.label)}</span></span>`, element.link)
        break
      }
      case 'header': content = headerMarkup(element, project, pageSlug, assetHref(element.logoAssetId)); break
      case 'hero': content = `<div class="site-hero-content"><img src="${escapeHtml(assetHref(element.imageAssetId))}" alt=""><div class="site-hero-copy">` +
        (element.title ? `<strong>${escapeHtml(element.title)}</strong>` : '') +
        (element.subtitle ? `<span>${escapeHtml(element.subtitle)}</span>` : '') +
        (element.ctaLabel ? linkContent(`<span class="site-hero-cta">${escapeHtml(element.ctaLabel)}</span>`, element.ctaLink) : '') + '</div></div>'; break
    }
    return `<div class="${classes}"${element.kind === 'section' ? ` id="${escapeHtml(element.anchorId)}"` : ''} style="${escapeHtml(style)}">${content}</div>`
  }).join('\n')
}
