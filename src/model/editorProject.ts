export const EDITOR_PROJECT_SCHEMA_VERSION = 1 as const

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

export type EditorElement = {
  id: string
  kind: ElementKind
  position: ResponsiveValue<CanvasPosition>
  size: ResponsiveValue<ElementSize>
  visibility: ResponsiveValue<boolean>
  locked: boolean
}

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
