import type { EditorElement, EditorProjectState } from '../model/editorProject'

const fixtureElements: EditorElement[] = [
  {
    id: 'dev-selection-section',
    kind: 'section',
    position: {
      desktop: { x: 72, y: 80 },
      mobile: { x: 24, y: 72 },
    },
    size: {
      desktop: { width: 280, height: 160 },
      mobile: { width: 160, height: 120 },
    },
    visibility: { desktop: true },
    locked: false,
  },
  {
    id: 'dev-selection-text',
    kind: 'text',
    position: {
      desktop: { x: 400, y: 180 },
      mobile: { x: 196, y: 230 },
    },
    size: {
      desktop: { width: 240, height: 112 },
      mobile: { width: 160, height: 96 },
    },
    visibility: { desktop: true },
    locked: false,
  },
]

export function withElementSelectionFixture(
  state: EditorProjectState,
): EditorProjectState {
  return {
    ...state,
    project: {
      ...state.project,
      pages: state.project.pages.map((page) =>
        page.id === state.activePageId
          ? { ...page, elements: fixtureElements }
          : page,
      ),
    },
  }
}
