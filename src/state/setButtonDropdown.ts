import type { EditorProjectState } from '../model/editorProject'

export function setButtonDropdown(state: EditorProjectState, elementId: string,
  dropdown: boolean, updatedAt: string): EditorProjectState {
  const page = state.project.pages.find((item) => item.id === state.activePageId)
  const element = page?.elements.find((item) => item.id === elementId)
  if (!page || !element || element.kind !== 'button' || element.locked ||
    Boolean(element.dropdown) === dropdown) return state

  return {
    ...state,
    project: {
      ...state.project,
      updatedAt,
      pages: state.project.pages.map((item) => item.id === page.id ? {
        ...item,
        elements: item.elements.map((candidate) => candidate.id === element.id ? {
          ...element,
          dropdown,
          link: dropdown ? { type: 'none' as const } : element.link,
        } : candidate),
      } : item),
    },
  }
}
