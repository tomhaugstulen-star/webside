import { prepareImageFile } from '../assets/images/prepareImageFile'
import { createBlankProject, createEditorPage } from '../model/createEditorProject'
import { createEditorElement } from '../model/createEditorElement'
import { createStableId } from '../model/createStableId'
import type { EditorElement, EditorPage } from '../model/editorProject'
import { createImageAssetId, type ImageAssetId } from '../model/imageAsset'
import { DEFAULT_TEXT_ELEMENT_STYLE, type TextFontSize } from '../model/textElementStyle'
import type { ImportedProjectFile } from '../projectFiles/projectFileFormat'
import { htmlPathToSlug, resolveSitePath } from './genericSitePaths'
import { readZipEntries } from './readZipEntries'

type GenericReadResult =
  | { ok: true; value: ImportedProjectFile; warnings: string[] }
  | { ok: false; message: string }

type AssetMapEntry = {
  assetId: ImageAssetId
  metadata: ImportedProjectFile['assets'][number]['metadata']
  file: File
}

function mimeForPath(path: string) {
  const lower = path.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  return null
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
) {
  const element = createEditorElement({
    id: createStableId(),
    request: { kind: 'text' },
    existingElements: existing,
  })
  if (element.kind !== 'text') throw new Error('Kunne ikke opprette tekst.')
  const fontSize = headingSize(tagName)
  return {
    ...element,
    content,
    position: { desktop: { x: 80, y } },
    size: { desktop: { width: 760, height: Math.max(64, Math.round(fontSize * 2.2)) } },
    textStyle: {
      ...DEFAULT_TEXT_ELEMENT_STYLE,
      fontSize,
      fontWeight: tagName.startsWith('H') ? 'bold' as const : 'normal' as const,
    },
  }
}

function createPageFromHtml(
  htmlPath: string,
  html: string,
  assetsByPath: Map<string, AssetMapEntry>,
): EditorPage | null {
  const slug = htmlPathToSlug(htmlPath)
  if (!slug) return null
  const document = new DOMParser().parseFromString(html, 'text/html')
  const page = createEditorPage(createStableId(), pageName(document, slug), slug)
  page.seo = {
    title: document.querySelector('title')?.textContent?.trim().slice(0, 120) || page.name,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim().slice(0, 300) || '',
  }

  let y = 60
  const candidates = [...document.body.querySelectorAll('h1,h2,h3,p,li,a,img')]
  for (const node of candidates) {
    if (node.parentElement?.closest('h1,h2,h3,p,li,a')) continue

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
      const width = Math.min(760, asset.metadata.width)
      const height = Math.max(80, Math.round(asset.metadata.height * width / asset.metadata.width))
      page.elements.push({
        ...element,
        altText: node.getAttribute('alt')?.slice(0, 300) || '',
        position: { desktop: { x: 80, y } },
        size: { desktop: { width, height } },
      })
      y += height + 28
      continue
    }

    const text = node.textContent?.replace(/\s+/g, ' ').trim()
    if (!text) continue
    page.elements.push(makeTextElement(text.slice(0, 2000), node.tagName, y, page.elements))
    y += node.tagName.startsWith('H') ? 96 : 76
  }

  return page
}

export async function readGenericSiteZip(file: File): Promise<GenericReadResult> {
  try {
    const entries = await readZipEntries(file)
    const htmlEntries = entries.filter((entry) => entry.path.toLowerCase().endsWith('.html'))
    if (!htmlEntries.length) {
      return { ok: false, message: 'ZIP-filen inneholder ingen HTML-sider.' }
    }

    const assetsByPath = new Map<string, AssetMapEntry>()
    const assets: ImportedProjectFile['assets'] = []
    for (const entry of entries) {
      const mime = mimeForPath(entry.path)
      if (!mime) continue
      const name = entry.path.split('/').at(-1) || 'bilde'
      const prepared = await prepareImageFile(new File([entry.bytes], name, { type: mime }))
      if (!prepared.ok) continue
      const assetId = createImageAssetId()
      const asset = { assetId, metadata: prepared.value.metadata, file: prepared.value.file }
      assetsByPath.set(entry.path, asset)
      assets.push(asset)
    }

    const project = createBlankProject(
      file.name.replace(/\.zip$/i, '').replace(/[-_]+/g, ' ').trim() || 'Importert nettsted',
    )
    project.pages = []
    const decoder = new TextDecoder()
    for (const entry of htmlEntries) {
      const page = createPageFromHtml(entry.path, decoder.decode(entry.bytes), assetsByPath)
      if (page) project.pages.push(page)
    }
    if (!project.pages.length) {
      return { ok: false, message: 'Ingen støttede HTML-sider kunne importeres.' }
    }

    return {
      ok: true,
      value: { project, assets },
      warnings: [
        'Original CSS og avansert layout er ikke bevart i denne første importversjonen.',
      ],
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Nettstedet kunne ikke importeres.',
    }
  }
}
