import {
  createDefaultSolidFill,
  isEditorFill,
  type EditorFill,
} from './editorFill'
import {
  DEFAULT_ELEMENT_FRAME,
  isValidElementFrame,
  type ElementFrame,
} from './elementFrame'

export type TextAppearance = {
  backgroundFill: EditorFill
  frame: ElementFrame
}

export const DEFAULT_TEXT_APPEARANCE: TextAppearance = {
  backgroundFill: createDefaultSolidFill('#FFFFFF'),
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
    isEditorFill(value.backgroundFill) &&
    isValidElementFrame(value.frame)
  )
}
