import {
  createEditorColor,
  isEditorColor,
  type EditorColor,
} from './editorColor'
import {
  DEFAULT_ELEMENT_FRAME,
  isValidElementFrame,
  type ElementFrame,
} from './elementFrame'

export type TextAppearance = {
  backgroundColor: EditorColor
  frame: ElementFrame
}

export const DEFAULT_TEXT_APPEARANCE: TextAppearance = {
  backgroundColor: createEditorColor('#FFFFFF'),
  frame: { ...DEFAULT_ELEMENT_FRAME },
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

  const value = appearance as Record<string, unknown>

  return (
    Object.keys(value).length === 2 &&
    isEditorColor(value.backgroundColor) &&
    isValidElementFrame(value.frame)
  )
}
