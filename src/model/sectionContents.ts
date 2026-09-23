import type { EditorElement, SectionEditorElement } from './editorProject'

export function getSectionContents(
  section: SectionEditorElement,
  elements: readonly EditorElement[],
) {
  const frame = section.position.desktop
  const size = section.size.desktop

  return elements.filter((element) => {
    if (element.kind === 'header' || element.kind === 'section') return false
    const position = element.position.desktop
    const elementSize = element.size.desktop

    return (
      position.x >= frame.x &&
      position.y >= frame.y &&
      position.x + elementSize.width <= frame.x + size.width &&
      position.y + elementSize.height <= frame.y + size.height
    )
  })
}
