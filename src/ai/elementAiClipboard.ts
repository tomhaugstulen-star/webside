import type { ElementLayout } from '../model/elementLayout'
import type { EditorElement } from '../model/editorProject'

const TYPE_LABELS: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
  header: 'Header',
  hero: 'Hero',
}

export function getElementAiLabel(element: EditorElement) {
  switch (element.kind) {
    case 'section':
      return element.anchorId
    case 'image':
      return element.altText || element.assetMetadata.fileName
    case 'text':
      return element.content.trim() || 'Tekstelement'
    case 'button':
      return element.label
    case 'header':
      return element.siteName || 'Header'
    case 'hero':
      return element.title || 'Hero'
  }
}

export function getElementAiTypeLabel(element: EditorElement) {
  return TYPE_LABELS[element.kind]
}

export function createElementAiClip(
  element: EditorElement,
  layout: ElementLayout,
  instruction: string,
) {
  return [
    'WEBSITE_EDITOR_CLIP v1',
    '',
    'Element:',
    `Type: ${getElementAiTypeLabel(element)}`,
    `Element: ${getElementAiLabel(element)}`,
    `Width: ${Math.round(layout.size.width)} px`,
    `Height: ${Math.round(layout.size.height)} px`,
    '',
    'Instruksjon:',
    instruction.trim(),
  ].join('\n')
}
