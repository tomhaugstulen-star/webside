import { createStableId } from '../model/createStableId'
import type { EditorElement } from '../model/editorProject'
import type { ImageAssetId } from '../model/imageAsset'
import { createUniqueSectionAnchorId } from '../model/siteStructure'
import type { ImageAssetRegistration } from '../assets/images/imageAssetStoreContext'
import type { SectionTemplate } from './sectionTemplate'

export type SectionTemplateInsertion = {
  elements: EditorElement[]
  assets: ImageAssetRegistration[]
  selectedElementId: string
}

function getNextInsertionY(elements: readonly EditorElement[]) {
  return elements.reduce(
    (bottom, element) =>
      Math.max(
        bottom,
        element.position.desktop.y + element.size.desktop.height,
      ),
    0,
  ) + 32
}

function remapElementAsset(
  element: EditorElement,
  assetIds: ReadonlyMap<ImageAssetId, ImageAssetId>,
): EditorElement {
  if (element.kind === 'image') {
    return { ...element, assetId: assetIds.get(element.assetId) ?? element.assetId }
  }

  if (element.kind === 'hero') {
    return {
      ...element,
      imageAssetId:
        assetIds.get(element.imageAssetId) ?? element.imageAssetId,
    }
  }

  return element
}

export function instantiateSectionTemplate(
  template: SectionTemplate,
  targetElements: readonly EditorElement[],
): SectionTemplateInsertion | null {
  const sourceSection = template.elements.find(
    (element) => element.kind === 'section',
  )

  if (!sourceSection || sourceSection.kind !== 'section') return null

  const existingAnchors = targetElements
    .filter((element) => element.kind === 'section')
    .map((element) => element.kind === 'section' ? element.anchorId : '')
  const newAnchorId = createUniqueSectionAnchorId(
    existingAnchors,
    sourceSection.anchorId,
  )
  const idMap = new Map(template.elements.map((element) => [
    element.id,
    createStableId(),
  ]))
  const assetIdMap = new Map(template.assets.map((asset) => [
    asset.assetId,
    createStableId(),
  ]))
  const insertY = getNextInsertionY(targetElements)
  const yOffset = insertY - sourceSection.position.desktop.y

  const elements = template.elements.map((source) => {
    const remapped = remapElementAsset(structuredClone(source), assetIdMap)
    const position = {
      desktop: {
        ...remapped.position.desktop,
        y: remapped.position.desktop.y + yOffset,
      },
      ...(remapped.position.mobile
        ? {
            mobile: {
              ...remapped.position.mobile,
              y: remapped.position.mobile.y + yOffset,
            },
          }
        : {}),
    }

    return {
      ...remapped,
      id: idMap.get(source.id) ?? createStableId(),
      position,
      ...(remapped.kind === 'section' ? { anchorId: newAnchorId } : {}),
    } as EditorElement
  })

  const section = elements.find((element) => element.kind === 'section')
  if (!section) return null

  return {
    elements,
    selectedElementId: section.id,
    assets: template.assets.map((asset) => ({
      assetId: assetIdMap.get(asset.assetId) ?? createStableId(),
      metadata: { ...asset.metadata },
      file: asset.file,
    })),
  }
}
