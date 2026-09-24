import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import darkButton from '../assets/buttons/dark-rounded.svg?raw'
import outlineButton from '../assets/buttons/outline-rounded.svg?raw'
import primaryButton from '../assets/buttons/primary-rounded.svg?raw'
import secondaryButton from '../assets/buttons/secondary-rounded.svg?raw'
import { BUTTON_ASSET_IDS } from '../model/buttonAsset'
import type { EditorProject } from '../model/editorProject'
import { isValidEditorProject } from '../model/editorProjectValidation'
import type { ImageAssetId } from '../model/imageAsset'
import { editorFillToCssBackground } from '../model/editorFill'
import { getProjectAssetReferences, imageAssetMetadataEqual } from '../projectFiles/projectAssetReferences'
import { resolveResponsiveElementLayout } from '../model/resolveResponsiveElementLayout'
import { resolveResponsiveValue } from '../model/resolveResponsiveValue'
import css from './publicSite.css?raw'
import javascript from './publicSite.js?raw'
import { createZip, type ZipEntry } from './createZip'
import { renderPublicElements } from './renderPublicElements'
import { escapeHtml, pageFilePath, relativeRoot } from './sitePaths'

const encoder = new TextEncoder()
const buttonAssets = [
  { id: BUTTON_ASSET_IDS.primaryRounded, name: 'primary', svg: primaryButton, color: '#FFFFFF' },
  { id: BUTTON_ASSET_IDS.secondaryRounded, name: 'secondary', svg: secondaryButton, color: '#5F342A' },
  { id: BUTTON_ASSET_IDS.outlineRounded, name: 'outline', svg: outlineButton, color: '#8F432F' },
  { id: BUTTON_ASSET_IDS.darkRounded, name: 'dark', svg: darkButton, color: '#FFFFFF' },
]

function renderPage(project: EditorProject, slug: string, assets: Map<string, string>,
  buttons: Map<string, string>,
  cssPath: string, scriptPath: string) {
  const page = project.pages.find((item) => item.slug === slug)
  if (!page) throw new Error('Ugyldig side i eksporten.')
  const root = relativeRoot(slug)
  const title = page.seo.title || page.name
  const canonical = project.siteSettings.publicUrl
    ? `${project.siteSettings.publicUrl}${slug.slice(1)}${slug === '/' ? '' : '/'}` : ''
  const assetHref = (id: string) => {
    const path = assets.get(id)
    if (!path) throw new Error('Et bilde mangler i eksporten.')
    return root + path
  }
  const buttonHref = (id: string) => {
    const asset = buttonAssets.find((item) => item.id === id)
    if (!asset) throw new Error('Knappdesign mangler i eksporten.')
    const path = buttons.get(id)
    if (!path) throw new Error('Knappdesign mangler i eksporten.')
    return { href: root + path, color: asset.color }
  }
  const elements = renderPublicElements(project, slug, assetHref, buttonHref)
  const desktopHeight = page.elements.reduce((height, element) => {
    if (!element.visibility.desktop) return height
    const layout = resolveResponsiveElementLayout(element, 'desktop', 1080)
    return Math.max(height, layout.position.y + layout.size.height + 48)
  }, 620)
  const mobileHeight = page.elements.reduce((height, element) => {
    if (!resolveResponsiveValue(element.visibility, 'mobile')) return height
    const layout = resolveResponsiveElementLayout(element, 'mobile', 390)
    return Math.max(height, layout.position.y + layout.size.height + 48)
  }, 620)
  const background = editorFillToCssBackground(page.appearance.backgroundFill)
  return `<!doctype html><html lang="${escapeHtml(project.siteSettings.language)}"><head>` +
    `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>${escapeHtml(title)}</title>` +
    `<meta name="description" content="${escapeHtml(page.seo.description)}">` +
    (canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : '') +
    `<link rel="stylesheet" href="${root}${cssPath}"><script src="${root}${scriptPath}" defer></script>` +
    `</head><body><main class="site-page" style="background:${escapeHtml(background)};min-height:${desktopHeight}px;--mobile-height:${mobileHeight}px">` +
    `${elements}</main></body></html>`
}

export async function createStaticSiteZip(project: EditorProject,
  getAsset: (id: ImageAssetId) => ImageAssetResource | null): Promise<Blob> {
  if (!isValidEditorProject(project)) throw new Error('Prosjektet er ugyldig.')
  if (!project.pages.some((page) => page.slug === '/')) {
    throw new Error('Prosjektet trenger en forside med adressen /.')
  }
  const references = getProjectAssetReferences(project)
  if (!references) throw new Error('Bildene har motstridende metadata.')
  const entries: ZipEntry[] = []
  const assetPaths = new Map<string, string>()
  const contentHash = async (bytes: Uint8Array<ArrayBuffer>) =>
    Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
      .slice(0, 12).map((n) => n.toString(16).padStart(2, '0')).join('')
  for (const reference of references) {
    const resource = getAsset(reference.assetId)
    if (!resource || !imageAssetMetadataEqual(reference.metadata, resource.metadata) ||
      resource.file.name !== reference.metadata.fileName ||
      resource.file.type !== reference.metadata.mimeType ||
      resource.file.size !== reference.metadata.byteSize) {
      throw new Error(`Bildet «${reference.metadata.fileName}» mangler eller er endret.`)
    }
    const bytes = new Uint8Array(await resource.file.arrayBuffer())
    const hash = await contentHash(bytes)
    const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[reference.metadata.mimeType]
    const path = `assets/image-${hash}.${extension}`
    assetPaths.set(reference.assetId, path)
    if (!entries.some((entry) => entry.path === path)) entries.push({ path, bytes })
  }
  const cssBytes = encoder.encode(css)
  const scriptBytes = encoder.encode(javascript)
  const cssPath = `assets/site-${await contentHash(cssBytes)}.css`
  const scriptPath = `assets/site-${await contentHash(scriptBytes)}.js`
  const buttons = new Map<string, string>()
  for (const asset of buttonAssets) {
    const bytes = encoder.encode(asset.svg)
    const path = `assets/button-${asset.name}-${await contentHash(bytes)}.svg`
    buttons.set(asset.id, path)
    entries.push({ path, bytes })
  }
  for (const page of project.pages) entries.push({
    path: pageFilePath(page.slug), bytes: encoder.encode(renderPage(project, page.slug, assetPaths, buttons, cssPath, scriptPath)),
  })
  entries.push({ path: cssPath, bytes: cssBytes })
  entries.push({ path: scriptPath, bytes: scriptBytes })
  if (project.siteSettings.publicUrl) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      project.pages.map((page) => `<url><loc>${escapeHtml(project.siteSettings.publicUrl + page.slug.slice(1) + (page.slug === '/' ? '' : '/'))}</loc></url>`).join('') + '</urlset>'
    entries.push({ path: 'sitemap.xml', bytes: encoder.encode(sitemap) })
  }
  return createZip(entries)
}
