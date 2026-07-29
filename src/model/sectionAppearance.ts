import { createEditorColor, isEditorColor, type EditorColor } from './editorColor'

export const sectionFrameWidths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

export type SectionFrameWidth = (typeof sectionFrameWidths)[number]

export type SectionFrame = {
  width: SectionFrameWidth
  color: EditorColor
}

export type SectionAppearance = {
  backgroundColor: EditorColor
  frame: SectionFrame
}

export const DEFAULT_SECTION_APPEARANCE: SectionAppearance = {
  backgroundColor: createEditorColor('#FFFDFB'),
  frame: {
    width: 0,
    color: createEditorColor('#D8CEC8'),
  },
}

export function isSectionFrameWidth(value: unknown): value is SectionFrameWidth {
  return sectionFrameWidths.includes(value as SectionFrameWidth)
}

export function isValidSectionAppearance(
  value: unknown,
): value is SectionAppearance {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const appearance = value as Record<string, unknown>
  const frame = appearance.frame

  if (typeof frame !== 'object' || frame === null || Array.isArray(frame)) {
    return false
  }

  const frameRecord = frame as Record<string, unknown>

  return (
    Object.keys(appearance).length === 2 &&
    Object.keys(frameRecord).length === 2 &&
    isEditorColor(appearance.backgroundColor) &&
    isSectionFrameWidth(frameRecord.width) &&
    isEditorColor(frameRecord.color)
  )
}
