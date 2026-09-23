import {
  createEditorColor,
  isEditorColor,
  type EditorColor,
} from './editorColor'
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

export type HeroAppearance = {
  backgroundFill: EditorFill
  textColor: EditorColor
  frame: ElementFrame
}

export const DEFAULT_HERO_APPEARANCE: HeroAppearance = {
  backgroundFill: createDefaultSolidFill('#1F2937'),
  textColor: createEditorColor('#FFFFFF'),
  frame: { ...DEFAULT_ELEMENT_FRAME },
}

export function isValidHeroAppearance(value: unknown): value is HeroAppearance {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const appearance = value as Record<string, unknown>

  return (
    Object.keys(appearance).length === 3 &&
    isEditorFill(appearance.backgroundFill) &&
    isEditorColor(appearance.textColor) &&
    isValidElementFrame(appearance.frame)
  )
}
