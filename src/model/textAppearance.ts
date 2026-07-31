import {
  createEditorColor,
  isEditorColor,
  type EditorColor,
} from './editorColor'

export type TextAppearance = {
  backgroundColor: EditorColor
}

export const DEFAULT_TEXT_APPEARANCE: TextAppearance = {
  backgroundColor: createEditorColor('#FFFFFF'),
}

export function isValidTextAppearance(
  appearance: unknown,
): appearance is TextAppearance {
  if (
    typeof appearance !== 'object' ||
    appearance === null ||
    Array.isArray(appearance)
  ) {
    return false
  }

  const keys = Object.keys(appearance)

  return (
    keys.length === 1 &&
    keys[0] === 'backgroundColor' &&
    isEditorColor(
      (appearance as { backgroundColor?: unknown }).backgroundColor,
    )
  )
}
