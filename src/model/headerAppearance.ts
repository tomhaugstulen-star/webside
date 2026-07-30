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

export type HeaderAppearance = {
  textColor: EditorColor
  frame: ElementFrame
}

export const DEFAULT_HEADER_APPEARANCE: HeaderAppearance = {
  textColor: createEditorColor('#282421'),
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
    Object.keys(appearance).length === 2 &&
    isEditorColor(appearance.textColor) &&
    isValidElementFrame(appearance.frame)
  )
}
