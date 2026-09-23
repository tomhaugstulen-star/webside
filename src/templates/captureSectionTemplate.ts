import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import type { EditorElement, EditorPage } from '../model/editorProject'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'
import { getSectionContents } from '../model/sectionContents'
import { imageAssetMetadataEqual } from '../projectFiles/projectAssetReferences'
import type { SectionTemplate, SectionTemplateAsset } from './sectionTemplate'

type GetImageAsset = (assetId: ImageAssetId) => ImageAssetResource | null

function getAssetReference(
  element: EditorElement,
): { assetId: ImageAssetId; metadata: ImageAssetMetadata } | null {
  if (element.kind === 'image') {
    return { assetId: element.assetId, metadata: element.assetMetadata }
  }

  if (element.kind === 'hero') {
    return {
      assetId: element.imageAssetId,
      metadata: element.imageAssetMetadata,
    }
  }

  return null
}

export function captureSectionTemplate(
  page: EditorPage,
  sectionId: string,
  template: Pick<SectionTemplate, 'id' | 'name' | 'createdAt'>,
  getImageAsset: GetImageAsset,
): SectionTemplate | null {
  const section = page.elements.find(
    (element) => element.id === sectionId && element.kind === 'section',
  )

  if (!section || section.kind !== 'section') return null

  const contents = new Set(
    getSectionContents(section, page.elements).map((element) => element.id),
  )
  const elements = page.elements.filter(
    (element) => element.id === section.id || contents.has(element.id),
  )
  const assetsById = new Map<ImageAssetId, SectionTemplateAsset>()

  for (const element of elements) {
    const reference = getAssetReference(element)
    if (!reference || assetsById.has(reference.assetId)) continue

    const resource = getImageAsset(reference.assetId)
    if (
      !resource ||
      !imageAssetMetadataEqual(reference.metadata, resource.metadata)
    ) {
      return null
    }

    assetsById.set(reference.assetId, {
      assetId: reference.assetId,
      metadata: { ...resource.metadata },
      file: resource.file,
    })
  }

  return {
    version: 1,
    ...template,
    elements: elements.map((element) => structuredClone(element)),
    assets: [...assetsById.values()],
  }
}
