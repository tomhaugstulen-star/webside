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

function includesValue<T extends readonly unknown[]>(values: T, value: unknown) {
  return values.includes(value as T[number])
}

const textElementStyleValidators: Record<
  keyof TextElementStyle,
  (value: unknown) => boolean
> = {
  fontFamily: (value) => includesValue(textFontFamilies, value),
  fontSize: (value) => includesValue(textFontSizes, value),
  fontWeight: (value) => includesValue(textFontWeights, value),
  fontStyle: (value) => includesValue(textFontStyles, value),
  textAlign: (value) => includesValue(textAlignments, value),
  lineHeight: (value) => includesValue(textLineHeights, value),
}

const textElementStyleKeys = Object.keys(textElementStyleValidators)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isTextElementStyleKey(key: string): key is keyof TextElementStyle {
  return Object.hasOwn(textElementStyleValidators, key)
}

export function isValidTextElementStyle(style: unknown): style is TextElementStyle {
  if (!isRecord(style)) {
    return false
  }

  const keys = Object.keys(style)

  return (
    keys.length === textElementStyleKeys.length &&
    keys.every(isTextElementStyleKey) &&
    keys.every((key) => textElementStyleValidators[key](style[key]))
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

  return isTextElementStyleKey(key) && textElementStyleValidators[key](value)
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
