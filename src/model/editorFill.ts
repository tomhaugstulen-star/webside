import {
  createEditorColor,
  isEditorColor,
  type EditorColor,
} from './editorColor'

export const DEFAULT_GRADIENT_ANGLE = 90

export type EditorSolidFill = {
  type: 'solid'
  color: EditorColor
}

export type EditorLinearGradientFill = {
  type: 'linear-gradient'
  angle: number
  stops: [EditorColor, EditorColor]
}

export type EditorFill = EditorSolidFill | EditorLinearGradientFill

export function createSolidFill(color: EditorColor): EditorSolidFill {
  return { type: 'solid', color }
}

export function createDefaultSolidFill(value: string): EditorSolidFill {
  return createSolidFill(createEditorColor(value))
}

export function createLinearGradientFill(
  first: EditorColor,
  second: EditorColor = first,
  angle = DEFAULT_GRADIENT_ANGLE,
): EditorLinearGradientFill {
  return { type: 'linear-gradient', angle, stops: [first, second] }
}

export function isEditorGradientAngle(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 360
  )
}

export function isEditorFill(value: unknown): value is EditorFill {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const fill = value as Record<string, unknown>
  const keys = Object.keys(fill)

  if (fill.type === 'solid') {
    return (
      keys.length === 2 &&
      keys.includes('type') &&
      keys.includes('color') &&
      isEditorColor(fill.color)
    )
  }

  if (fill.type === 'linear-gradient') {
    return (
      keys.length === 3 &&
      keys.includes('type') &&
      keys.includes('angle') &&
      keys.includes('stops') &&
      isEditorGradientAngle(fill.angle) &&
      Array.isArray(fill.stops) &&
      fill.stops.length === 2 &&
      fill.stops.every(isEditorColor)
    )
  }

  return false
}

export function editorFillsEqual(first: EditorFill, second: EditorFill) {
  if (first.type !== second.type) return false
  if (first.type === 'solid' && second.type === 'solid') {
    return first.color === second.color
  }
  if (first.type === 'linear-gradient' && second.type === 'linear-gradient') {
    return (
      first.angle === second.angle &&
      first.stops[0] === second.stops[0] &&
      first.stops[1] === second.stops[1]
    )
  }
  return false
}

export function editorFillToCssBackground(fill: EditorFill) {
  return fill.type === 'solid'
    ? fill.color
    : `linear-gradient(${fill.angle}deg, ${fill.stops[0]} 0%, ${fill.stops[1]} 100%)`
}

export function toLinearGradientFill(fill: EditorFill): EditorLinearGradientFill {
  return fill.type === 'linear-gradient'
    ? fill
    : createLinearGradientFill(fill.color)
}

export function toSolidFill(fill: EditorFill): EditorSolidFill {
  return fill.type === 'solid' ? fill : createSolidFill(fill.stops[0])
}
