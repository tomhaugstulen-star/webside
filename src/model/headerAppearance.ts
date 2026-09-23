import {
  createDefaultSolidFill,
  isEditorFill,
  type EditorFill,
} from './editorFill'
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
import {
  isTextFontFamily,
  isTextFontSize,
  type TextFontFamily,
  type TextFontSize,
} from './textElementStyle'

export type HeaderAppearance = {
  backgroundFill: EditorFill
  textColor: EditorColor
  fontFamily: TextFontFamily
  fontSize: TextFontSize
  frame: ElementFrame
}

export const DEFAULT_HEADER_APPEARANCE: HeaderAppearance = {
  backgroundFill: createDefaultSolidFill('#FFFFFF'),
  textColor: createEditorColor('#282421'),
  fontFamily: 'system',
  fontSize: 24,
  frame: { ...DEFAULT_ELEMENT_FRAME },
}

export function isValidHeaderAppearance(
  value: unknown,
): value is HeaderAppearance {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const appearance = value as Record<string, unknown>

  return (
    Object.keys(appearance).length === 5 &&
    isEditorFill(appearance.backgroundFill) &&
    isEditorColor(appearance.textColor) &&
    isTextFontFamily(appearance.fontFamily) &&
    isTextFontSize(appearance.fontSize) &&
    isValidElementFrame(appearance.frame)
  )
}
