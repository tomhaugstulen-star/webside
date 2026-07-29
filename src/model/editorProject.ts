import type { ButtonAssetId } from './buttonAsset'
import type { ElementKind, ElementSize } from './elementDimensions'
import type { ElementLink } from './elementLink'
import type { ImageAssetId, ImageAssetMetadata } from './imageAsset'
import type { ImageMode, ImageTransform } from './imagePresentation'
import type { TextElementStyle } from './textElementStyle'

export type { ElementKind, ElementSize } from './elementDimensions'

export const EDITOR_PROJECT_SCHEMA_VERSION = 6 as const

export type ResponsiveViewport = 'desktop' | 'mobile'

export type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}

export type CanvasPosition = {
  x: number
  y: number
}

type BaseEditorElement = {
  id: string
  position: ResponsiveValue<CanvasPosition>
  size: ResponsiveValue<ElementSize>
  visibility: ResponsiveValue<boolean>
  locked: boolean
}

export type SectionEditorElement = BaseEditorElement & {
  kind: 'section'
}

export type ImageEditorElement = BaseEditorElement & {
  kind: 'image'
  assetId: ImageAssetId
  assetMetadata: ImageAssetMetadata
  altText: string
  mode: ImageMode
  transform: ImageTransform
}

export type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
  textStyle: TextElementStyle
  link: ElementLink
}

export type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
}

export type EditorElement =
  | SectionEditorElement
  | ImageEditorElement
  | TextEditorElement
  | ButtonEditorElement

export type EditorPage = {
  id: string
  name: string
  slug: string
  elements: EditorElement[]
}

export type EditorProject = {
  schemaVersion: typeof EDITOR_PROJECT_SCHEMA_VERSION
  id: string
  name: string
  pages: EditorPage[]
  createdAt: string
  updatedAt: string
}

export type EditorProjectState = {
  project: EditorProject
  activePageId: string
  selectedElementId: string | null
}
