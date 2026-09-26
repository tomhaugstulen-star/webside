import {
  createEditorColor,
  isEditorColor,
  type EditorColor,
} from './editorColor'

export const DEFAULT_GRADIENT_ANGLE = 90

export type EditorNoFill = {
  type: 'none'
}

export type EditorSolidFill = {
  type: 'solid'
  color: EditorColor
}

export type EditorLinearGradientFill = {
  type: 'linear-gradient'
  angle: number
  stops: [EditorColor, EditorColor] | [EditorColor, EditorColor, EditorColor]
}

export type EditorFill = EditorNoFill | EditorSolidFill | EditorLinearGradientFill

export function createNoFill(): EditorNoFill {
  return { type: 'none' }
}

export function createSolidFill(color: EditorColor): EditorSolidFill {
  return { type: 'solid', color }
}

export function createDefaultSolidFill(value: string): EditorSolidFill {
  return createSolidFill(createEditorColor(value))
}

export function createLinearGradientFill(
  first: EditorColor,
  second: EditorColor = first,
  third: EditorColor = second,
  angle = DEFAULT_GRADIENT_ANGLE,
): EditorLinearGradientFill {
  return { type: 'linear-gradient', angle, stops: [first, second, third] }
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

  if (fill.type === 'none') {
    return keys.length === 1 && keys[0] === 'type'
  }

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
      (fill.stops.length === 2 || fill.stops.length === 3) &&
      fill.stops.every(isEditorColor)
    )
  }

  return false
}

export function editorFillsEqual(first: EditorFill, second: EditorFill) {
  if (first.type !== second.type) return false
  if (first.type === 'none' && second.type === 'none') return true
  if (first.type === 'solid' && second.type === 'solid') {
    return first.color === second.color
  }
  if (first.type === 'linear-gradient' && second.type === 'linear-gradient') {
    return (
      first.angle === second.angle &&
      first.stops.length === second.stops.length &&
      first.stops.every((stop, index) => stop === second.stops[index])
    )
  }
  return false
}

export function editorFillToCssBackground(fill: EditorFill) {
  if (fill.type === 'none') return 'transparent'
  if (fill.type === 'solid') return fill.color
  if (fill.stops.length === 2) {
    return `linear-gradient(${fill.angle}deg, ${fill.stops[0]} 0%, ${fill.stops[1]} 100%)`
  }
  return `linear-gradient(${fill.angle}deg, ${fill.stops[0]} 0%, ${fill.stops[1]} 50%, ${fill.stops[2]} 100%)`
}

export function toLinearGradientFill(fill: EditorFill): EditorLinearGradientFill {
  if (fill.type === 'none') {
    return createLinearGradientFill(createEditorColor('#FFFFFF'))
  }
  if (fill.type === 'solid') return createLinearGradientFill(fill.color)
  return fill.stops.length === 3
    ? fill
    : createLinearGradientFill(fill.stops[0], fill.stops[1], fill.stops[1], fill.angle)
}

export function toSolidFill(fill: EditorFill): EditorSolidFill {
  if (fill.type === 'none') return createDefaultSolidFill('#FFFFFF')
  return fill.type === 'solid' ? fill : createSolidFill(fill.stops[0])
}
