import type { EditorColor } from './editorColor'
import { isEditorColor } from './editorColor'
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
  textColor: '#FFFFFF',
  frame: { ...DEFAULT_ELEMENT_FRAME },
}

export function isValidHeroAppearance(value: unknown): value is HeroAppearance {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const appearance = value as Record<string, unknown>
  const keys = Object.keys(appearance)

  return (
    keys.length === 3 &&
    keys.every((key) =>
      ['backgroundFill', 'textColor', 'frame'].includes(key),
    ) &&
    isEditorFill(appearance.backgroundFill) &&
    isEditorColor(appearance.textColor) &&
    isValidElementFrame(appearance.frame)
  )
}
