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

export {
  elementFrameWidths as sectionFrameWidths,
  isElementFrameWidth as isSectionFrameWidth,
} from './elementFrame'
export type {
  ElementFrame as SectionFrame,
  ElementFrameWidth as SectionFrameWidth,
} from './elementFrame'

export type SectionAppearance = {
  backgroundFill: EditorFill
  frame: ElementFrame
}

export const DEFAULT_SECTION_APPEARANCE: SectionAppearance = {
  backgroundFill: createDefaultSolidFill('#FFFDFB'),
  frame: { ...DEFAULT_ELEMENT_FRAME },
}

export function isValidSectionAppearance(
  value: unknown,
): value is SectionAppearance {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const appearance = value as Record<string, unknown>

  return (
    Object.keys(appearance).length === 2 &&
    isEditorFill(appearance.backgroundFill) &&
    isValidElementFrame(appearance.frame)
  )
}
