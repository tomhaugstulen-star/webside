import type { CSSProperties } from 'react'
import type { EditorElement } from '../../model/editorProject'
import { editorFillToCssBackground } from '../../model/editorFill'
import { getTextFontFamilyCssValue } from './getTextElementCssStyle'

export function getElementAppearanceCssStyle(
  element: EditorElement,
): CSSProperties {
  if (element.kind === 'section') {
    return {
      background: editorFillToCssBackground(element.appearance.backgroundFill),
      borderColor: element.appearance.frame.color,
      borderStyle: 'solid',
      borderWidth: element.appearance.frame.width,
    }
  }

  if (element.kind === 'text') {
    return {
      background: editorFillToCssBackground(element.appearance.backgroundFill),
      borderColor: element.appearance.frame.color,
      borderStyle: 'solid',
      borderWidth: element.appearance.frame.width,
    }
  }

  if (element.kind === 'header') {
    return {
      background: editorFillToCssBackground(element.appearance.backgroundFill),
      color: element.appearance.textColor,
      fontFamily: getTextFontFamilyCssValue(element.appearance.fontFamily),
      fontSize: element.appearance.fontSize,
      borderColor: element.appearance.frame.color,
      borderStyle: 'solid',
      borderWidth: element.appearance.frame.width,
    }
  }

  return {}
}
