import type { ButtonAssetId } from './buttonAsset'
import type { ElementSize } from './elementDimensions'
import type { ElementLink } from './elementLink'
import type { HeaderAppearance } from './headerAppearance'
import type { HeroAppearance } from './heroAppearance'
import type { ImageAssetId, ImageAssetMetadata } from './imageAsset'
import type { ImageMode, ImageTransform } from './imagePresentation'
import type { WebsiteNavigation } from './navigation'
import type { PageAppearance } from './pageAppearance'
import type { SectionAppearance } from './sectionAppearance'
import type { TextAppearance } from './textAppearance'
import type { TextElementStyle } from './textElementStyle'
import type { PageSeo, SiteSettings } from './siteSettings'

export type { ElementKind, ElementSize } from './elementDimensions'

export const EDITOR_PROJECT_SCHEMA_VERSION = 16 as const

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
  anchorId: string
  appearance: SectionAppearance
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
  appearance: TextAppearance
  textStyle: TextElementStyle
  link: ElementLink
}

export type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
  assetId: ButtonAssetId
  label: string
  link: ElementLink
  dropdown?: boolean
}

export type HeaderEditorElement = BaseEditorElement & {
  kind: 'header'
  logoAssetId: ImageAssetId
  logoAssetMetadata: ImageAssetMetadata
  siteName: string
  subtitle: string
  appearance: HeaderAppearance
}

export type HeroEditorElement = BaseEditorElement & {
  kind: 'hero'
  imageAssetId: ImageAssetId
  imageAssetMetadata: ImageAssetMetadata
  title: string
  subtitle: string
  ctaLabel: string
  ctaLink: ElementLink
  appearance: HeroAppearance
}

export type EditorElement =
  | SectionEditorElement
  | ImageEditorElement
  | TextEditorElement
  | ButtonEditorElement
  | HeaderEditorElement
  | HeroEditorElement

export type EditorPage = {
  id: string
  name: string
  slug: string
  seo: PageSeo
  appearance: PageAppearance
  elements: EditorElement[]
}

export type EditorProject = {
  schemaVersion: typeof EDITOR_PROJECT_SCHEMA_VERSION
  id: string
  name: string
  siteSettings: SiteSettings
  pages: EditorPage[]
  navigation: WebsiteNavigation
  createdAt: string
  updatedAt: string
}

export type EditorProjectState = {
  project: EditorProject
  activePageId: string
  selectedElementId: string | null
}
