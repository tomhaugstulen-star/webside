import type { CSSProperties } from 'react'
import type { EditorElement } from '../../model/editorProject'
import { getTextFontFamilyCssValue } from './getTextElementCssStyle'

export function getElementAppearanceCssStyle(
  element: EditorElement,
): CSSProperties {
  if (element.kind === 'section') {
    return {
      backgroundColor: element.appearance.backgroundColor,
      borderColor: element.appearance.frame.color,
      borderStyle: 'solid',
      borderWidth: element.appearance.frame.width,
    }
  }

  if (element.kind === 'header') {
    return {
      backgroundColor: element.appearance.backgroundColor,
      color: element.appearance.textColor,
      fontFamily: getTextFontFamilyCssValue(element.appearance.fontFamily),
      borderColor: element.appearance.frame.color,
      borderStyle: 'solid',
      borderWidth: element.appearance.frame.width,
    }
  }

  return {}
}
