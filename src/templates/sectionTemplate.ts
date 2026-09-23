import type { EditorElement } from '../model/editorProject'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'

export const SECTION_TEMPLATE_VERSION = 1 as const
export const MAX_SECTION_TEMPLATE_NAME_LENGTH = 80

export type SectionTemplateAsset = {
  assetId: ImageAssetId
  metadata: ImageAssetMetadata
  file: File
}

export type SectionTemplate = {
  version: typeof SECTION_TEMPLATE_VERSION
  id: string
  name: string
  createdAt: string
  elements: EditorElement[]
  assets: SectionTemplateAsset[]
}

export function normalizeSectionTemplateName(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidSectionTemplateName(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_SECTION_TEMPLATE_NAME_LENGTH &&
    normalizeSectionTemplateName(value) === value
  )
}
