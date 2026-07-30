import type { CSSProperties } from 'react'
import type {
  TextElementStyle,
  TextFontFamily,
} from '../../model/textElementStyle'

const textFontStacks: Record<TextFontFamily, string> = {
  system:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  arial: 'Arial, Helvetica, sans-serif',
  verdana: 'Verdana, Geneva, sans-serif',
  tahoma: 'Tahoma, Verdana, sans-serif',
  'trebuchet-ms': '"Trebuchet MS", Arial, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  'times-new-roman': '"Times New Roman", Times, serif',
  'courier-new': '"Courier New", Courier, monospace',
}

export function getTextElementCssStyle(
  textStyle: TextElementStyle,
): CSSProperties {
  return {
    fontFamily: textFontStacks[textStyle.fontFamily],
    fontSize: textStyle.fontSize,
    fontWeight: textStyle.fontWeight,
    fontStyle: textStyle.fontStyle,
    textAlign: textStyle.textAlign,
    lineHeight: textStyle.lineHeight,
    color: textStyle.color,
  }
}
