export const textFontFamilies = [
  'system',
  'arial',
  'verdana',
  'tahoma',
  'trebuchet-ms',
  'georgia',
  'times-new-roman',
  'courier-new',
] as const

export const textFontSizes = [
  12,
  14,
  16,
  18,
  20,
  24,
  28,
  32,
  36,
  40,
  48,
  56,
  64,
  72,
  96,
] as const

export const textLineHeights = [1, 1.2, 1.45, 1.6, 1.8, 2] as const
export const textAlignments = ['left', 'center', 'right'] as const
export const textFontWeights = ['normal', 'bold'] as const
export const textFontStyles = ['normal', 'italic'] as const

export type TextFontFamily = (typeof textFontFamilies)[number]
export type TextFontSize = (typeof textFontSizes)[number]
export type TextLineHeight = (typeof textLineHeights)[number]
export type TextAlignment = (typeof textAlignments)[number]
export type TextFontWeight = (typeof textFontWeights)[number]
export type TextFontStyle = (typeof textFontStyles)[number]

export type TextElementStyle = {
  fontFamily: TextFontFamily
  fontSize: TextFontSize
  fontWeight: TextFontWeight
  fontStyle: TextFontStyle
  textAlign: TextAlignment
  lineHeight: TextLineHeight
}

export type TextElementStylePatch = {
  [Key in keyof TextElementStyle]: Pick<TextElementStyle, Key>
}[keyof TextElementStyle]

export const DEFAULT_TEXT_ELEMENT_STYLE: TextElementStyle = {
  fontFamily: 'system',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'left',
  lineHeight: 1.45,
}

const textElementStyleKeys = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'textAlign',
  'lineHeight',
] as const satisfies readonly (keyof TextElementStyle)[]

function includesValue<T extends readonly unknown[]>(values: T, value: unknown) {
  return values.includes(value as T[number])
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isValidTextElementStyle(style: unknown): style is TextElementStyle {
  if (!isRecord(style)) {
    return false
  }

  const keys = Object.keys(style)

  return (
    keys.length === textElementStyleKeys.length &&
    keys.every((key) => textElementStyleKeys.includes(key as keyof TextElementStyle)) &&
    includesValue(textFontFamilies, style.fontFamily) &&
    includesValue(textFontSizes, style.fontSize) &&
    includesValue(textFontWeights, style.fontWeight) &&
    includesValue(textFontStyles, style.fontStyle) &&
    includesValue(textAlignments, style.textAlign) &&
    includesValue(textLineHeights, style.lineHeight)
  )
}

export function isValidTextElementStylePatch(
  patch: unknown,
): patch is TextElementStylePatch {
  if (!isRecord(patch)) {
    return false
  }

  const entries = Object.entries(patch)

  if (entries.length !== 1) {
    return false
  }

  const [key, value] = entries[0]

  switch (key) {
    case 'fontFamily':
      return includesValue(textFontFamilies, value)
    case 'fontSize':
      return includesValue(textFontSizes, value)
    case 'fontWeight':
      return includesValue(textFontWeights, value)
    case 'fontStyle':
      return includesValue(textFontStyles, value)
    case 'textAlign':
      return includesValue(textAlignments, value)
    case 'lineHeight':
      return includesValue(textLineHeights, value)
    default:
      return false
  }
}

export function textElementStylesEqual(
  first: TextElementStyle,
  second: TextElementStyle,
) {
  return (
    first.fontFamily === second.fontFamily &&
    first.fontSize === second.fontSize &&
    first.fontWeight === second.fontWeight &&
    first.fontStyle === second.fontStyle &&
    first.textAlign === second.textAlign &&
    first.lineHeight === second.lineHeight
  )
}
