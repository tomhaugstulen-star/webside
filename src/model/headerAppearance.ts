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
  type TextFontFamily,
} from './textElementStyle'

export type HeaderAppearance = {
  backgroundColor: EditorColor
  textColor: EditorColor
  fontFamily: TextFontFamily
  frame: ElementFrame
}

export const DEFAULT_HEADER_APPEARANCE: HeaderAppearance = {
  backgroundColor: createEditorColor('#FFFFFF'),
  textColor: createEditorColor('#282421'),
  fontFamily: 'system',
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
    Object.keys(appearance).length === 4 &&
    isEditorColor(appearance.backgroundColor) &&
    isEditorColor(appearance.textColor) &&
    isTextFontFamily(appearance.fontFamily) &&
    isValidElementFrame(appearance.frame)
  )
}
