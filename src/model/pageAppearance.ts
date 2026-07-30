import { createEditorColor, isEditorColor, type EditorColor } from './editorColor'

export type PageAppearance = {
  backgroundColor: EditorColor
}

export const DEFAULT_PAGE_APPEARANCE: PageAppearance = {
  backgroundColor: createEditorColor('#FFFFFF'),
}

export function isValidPageAppearance(value: unknown): value is PageAppearance {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const appearance = value as Record<string, unknown>
  return (
    Object.keys(appearance).length === 1 &&
    isEditorColor(appearance.backgroundColor)
  )
}
