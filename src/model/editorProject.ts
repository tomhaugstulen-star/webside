export const EDITOR_PROJECT_SCHEMA_VERSION = 2 as const

export type ResponsiveViewport = 'desktop' | 'mobile'

export type ResponsiveValue<T> = {
  desktop: T
  mobile?: T
}

export type CanvasPosition = {
  x: number
  y: number
}

export type ElementSize = {
  width: number
  height: number
}

export type ElementKind = 'section' | 'image' | 'text' | 'button'

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
}

export type TextEditorElement = BaseEditorElement & {
  kind: 'text'
  content: string
}

export type ButtonEditorElement = BaseEditorElement & {
  kind: 'button'
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
