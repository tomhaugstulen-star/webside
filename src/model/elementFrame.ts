import {
  createEditorColor,
  isEditorColor,
  type EditorColor,
} from './editorColor'

export const elementFrameWidths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

export type ElementFrameWidth = (typeof elementFrameWidths)[number]

export type ElementFrame = {
  width: ElementFrameWidth
  color: EditorColor
}

export const DEFAULT_ELEMENT_FRAME: ElementFrame = {
  width: 0,
  color: createEditorColor('#D8CEC8'),
}

export function isElementFrameWidth(value: unknown): value is ElementFrameWidth {
  return elementFrameWidths.includes(value as ElementFrameWidth)
}

export function isValidElementFrame(value: unknown): value is ElementFrame {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const frame = value as Record<string, unknown>

  return (
    Object.keys(frame).length === 2 &&
    isElementFrameWidth(frame.width) &&
    isEditorColor(frame.color)
  )
}
