import type { CSSProperties } from 'react'
import type { EditorElement } from '../../model/editorProject'

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
      color: element.appearance.textColor,
      borderColor: element.appearance.frame.color,
      borderStyle: 'solid',
      borderWidth: element.appearance.frame.width,
    }
  }

  return {}
}
