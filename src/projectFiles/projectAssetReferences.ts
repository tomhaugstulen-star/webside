import type { EditorProject } from '../model/editorProject'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'

export type ProjectAssetReference = {
  assetId: ImageAssetId
  metadata: ImageAssetMetadata
}

function metadataEqual(first: ImageAssetMetadata, second: ImageAssetMetadata) {
  return (
    first.fileName === second.fileName &&
    first.mimeType === second.mimeType &&
    first.byteSize === second.byteSize &&
    first.width === second.width &&
    first.height === second.height
  )
}

export function getProjectAssetReferences(
  project: EditorProject,
): ProjectAssetReference[] | null {
  const references = new Map<ImageAssetId, ImageAssetMetadata>()

  for (const page of project.pages) {
    for (const element of page.elements) {
      const reference =
        element.kind === 'image'
          ? { assetId: element.assetId, metadata: element.assetMetadata }
          : element.kind === 'header'
            ? {
                assetId: element.logoAssetId,
                metadata: element.logoAssetMetadata,
              }
            : element.kind === 'hero'
              ? {
                  assetId: element.imageAssetId,
                  metadata: element.imageAssetMetadata,
                }
              : null

      if (!reference) continue

      const existing = references.get(reference.assetId)
      if (existing && !metadataEqual(existing, reference.metadata)) {
        return null
      }

      references.set(reference.assetId, reference.metadata)
    }
  }

  return [...references].map(([assetId, metadata]) => ({
    assetId,
    metadata: { ...metadata },
  }))
}

export function imageAssetMetadataEqual(
  first: ImageAssetMetadata,
  second: ImageAssetMetadata,
) {
  return metadataEqual(first, second)
}
