import {
  createDefaultSolidFill,
  isEditorFill,
  type EditorFill,
} from './editorFill'

export type PageAppearance = {
  backgroundFill: EditorFill
}

export const DEFAULT_PAGE_APPEARANCE: PageAppearance = {
  backgroundFill: createDefaultSolidFill('#FFFFFF'),
}

export function isValidPageAppearance(value: unknown): value is PageAppearance {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const appearance = value as Record<string, unknown>
  return (
    Object.keys(appearance).length === 1 &&
    isEditorFill(appearance.backgroundFill)
  )
}
