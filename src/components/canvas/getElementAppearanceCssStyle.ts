import type { CSSProperties } from 'react'
import type { EditorElement } from '../../model/editorProject'

export function getElementAppearanceCssStyle(
  element: EditorElement,
): CSSProperties {
  if (element.kind !== 'section') {
    return {}
  }

  return {
    backgroundColor: element.appearance.backgroundColor,
    borderColor: element.appearance.frame.color,
    borderStyle: 'solid',
    borderWidth: element.appearance.frame.width,
  }
}
