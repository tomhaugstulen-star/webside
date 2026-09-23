import { createBlankProject } from '../../src/model/createEditorProject'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createImageAssetId } from '../../src/model/imageAsset'
import { PROJECT_FILE_FORMAT, type ProjectFileV1 } from '../../src/projectFiles/projectFileFormat'

export const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

export function projectFileFixture(): ProjectFileV1 {
  const project = createBlankProject('Bilder og logo')
  const assetId = createImageAssetId()
  const metadata = { fileName: 'pixel.png', mimeType: 'image/png' as const, byteSize: atob(pngBase64).length, width: 1, height: 1 }
  const image = createEditorElement({ id: 'image-1', existingElements: [], request: { kind: 'image', assetId, assetMetadata: metadata } })
  const header = createEditorElement({ id: 'header-1', existingElements: [], request: { kind: 'header', logoAssetId: assetId, logoAssetMetadata: metadata, siteName: 'Mitt nettsted', subtitle: 'Test' } })
  const hero = createEditorElement({ id: 'hero-1', existingElements: [image, header], request: { kind: 'hero', imageAssetId: assetId, imageAssetMetadata: metadata } })
  project.pages[0].elements = [image, header, hero]
  project.pages.push({ ...project.pages[0], id: 'page-2', name: 'Side 2', slug: '/side-2', elements: [{ ...image, id: 'image-2' }] })
  return { format: PROJECT_FILE_FORMAT, formatVersion: 1, project, assets: [{ assetId, metadata, base64: pngBase64 }] }
}
