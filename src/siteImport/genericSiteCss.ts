import { normalizeEditorColor, type EditorColor } from '../model/editorColor'
import {
  createLinearGradientFill,
  createSolidFill,
  type EditorFill,
} from '../model/editorFill'
import {
  textFontFamilies,
  textFontSizes,
  type TextAlignment,
  type TextElementStyle,
  type TextFontFamily,
  type TextFontSize,
} from '../model/textElementStyle'

type CssMap = Map<string, string>

function parseDeclarations(source: string) {
  const result: CssMap = new Map()
  for (const part of source.split(';')) {
    const colon = part.indexOf(':')
    if (colon < 1) continue
    const key = part.slice(0, colon).trim().toLowerCase()
    const value = part.slice(colon + 1).trim().replace(/\s*!important\s*$/i, '')
    if (key && value) result.set(key, value)
  }
  return result
}

function safeSelector(selector: string) {
  return /^(?:[a-z][\w-]*|\.[\w-]+|#[\w-]+|[a-z][\w-]*\.[\w-]+)$/i.test(selector)
}

export function collectCssForElement(element: Element, cssText: string) {
  const result: CssMap = new Map()
  const cleaned = cssText.replace(/\/\*[\s\S]*?\*\//g, '')
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g
  let match: RegExpExecArray | null

  while ((match = rulePattern.exec(cleaned))) {
    for (const rawSelector of match[1].split(',')) {
      const selector = rawSelector.trim()
      if (!safeSelector(selector)) continue
      try {
        if (!element.matches(selector)) continue
      } catch {
        continue
      }
      for (const [key, value] of parseDeclarations(match[2])) result.set(key, value)
    }
  }

  const inline = element.getAttribute('style')
  if (inline) {
    for (const [key, value] of parseDeclarations(inline)) result.set(key, value)
  }
  return result
}

export function cssPixel(value: string | undefined) {
  const match = value?.trim().match(/^(-?\d+(?:\.\d+)?)px$/i)
  if (!match) return null
  const number = Number(match[1])
  return Number.isFinite(number) ? Math.round(number) : null
}

function rgbToHex(value: string) {
  const match = value.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i,
  )
  if (!match) return null
  if (match[4] !== undefined && Number(match[4]) <= 0) return null
  const channels = match.slice(1, 4).map((part) =>
    Math.max(0, Math.min(255, Number(part))).toString(16).padStart(2, '0'),
  )
  return normalizeEditorColor('#' + channels.join(''))
}

export function cssColor(value: string | undefined): EditorColor | null {
  if (!value) return null
  const trimmed = value.trim()
  if (trimmed.toLowerCase() === 'transparent') return null
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const expanded = '#' + [...trimmed.slice(1)].map((char) => char + char).join('')
    return normalizeEditorColor(expanded)
  }
  return normalizeEditorColor(trimmed) ?? rgbToHex(trimmed)
}

function closestFontSize(value: number): TextFontSize {
  return textFontSizes.reduce((best, size) =>
    Math.abs(size - value) < Math.abs(best - value) ? size : best,
  )
}

function fontFamily(value: string | undefined): TextFontFamily | null {
  if (!value) return null
  const normalized = value.toLowerCase().replace(/["']/g, '')
  const match = textFontFamilies.find((font) =>
    normalized.includes(font.replace(/-/g, ' ')) || normalized.includes(font),
  )
  return match ?? null
}

export function applyCssTextStyle(
  base: TextElementStyle,
  css: CssMap,
): TextElementStyle {
  const sizePx = cssPixel(css.get('font-size'))
  const color = cssColor(css.get('color'))
  const family = fontFamily(css.get('font-family'))
  const weightValue = css.get('font-weight')?.toLowerCase()
  const numericWeight = weightValue ? Number(weightValue) : NaN
  const alignment = css.get('text-align')?.toLowerCase()
  const textAlign: TextAlignment = alignment === 'center' || alignment === 'right'
    ? alignment
    : alignment === 'left' ? 'left' : base.textAlign

  return {
    ...base,
    fontSize: sizePx && sizePx > 0 ? closestFontSize(sizePx) : base.fontSize,
    color: color ?? base.color,
    fontFamily: family ?? base.fontFamily,
    fontWeight: weightValue === 'bold' || numericWeight >= 600 ? 'bold' : base.fontWeight,
    fontStyle: css.get('font-style')?.toLowerCase() === 'italic' ? 'italic' : base.fontStyle,
    textAlign,
  }
}


export function cssBackgroundFill(value: string | undefined): EditorFill | null {
  if (!value) return null
  const solid = cssColor(value)
  if (solid) return createSolidFill(solid)

  const match = value.trim().match(/^linear-gradient\((.+)\)$/i)
  if (!match) return null
  const parts = match[1].split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length < 2 || parts.length > 4) return null

  let angle = 180
  if (/^-?\d+(?:\.\d+)?deg$/i.test(parts[0])) {
    angle = ((Number(parts.shift()!.replace(/deg$/i, '')) % 360) + 360) % 360
  }
  const colors = parts.map((part) => {
    const token = part.match(/^(#[0-9a-f]{3,6}|rgba?\([^)]*\))/i)?.[1]
    return token ? cssColor(token) : null
  })
  if (colors.length < 2 || colors.length > 3 || colors.some((color) => !color)) return null

  const [first, second, third] = colors as [EditorColor, EditorColor, EditorColor?]
  return third
    ? createLinearGradientFill(first, second, third, angle)
    : { type: 'linear-gradient', angle, stops: [first, second] }
}
