import type { EditorElement, EditorProject } from './editorProject'
import type { ImageAssetId } from './imageAsset'

export function getElementImageAssetId(
  element: EditorElement,
): ImageAssetId | null {
  if (element.kind === 'image') return element.assetId
  if (element.kind === 'header') return element.logoAssetId
  if (element.kind === 'hero') return element.imageAssetId
  return null
}

export function projectReferencesImageAsset(
  project: EditorProject,
  assetId: ImageAssetId,
  excludedElementId?: string,
) {
  return project.pages.some((page) =>
    page.elements.some(
      (element) =>
        element.id !== excludedElementId &&
        getElementImageAssetId(element) === assetId,
    ),
  )
}
