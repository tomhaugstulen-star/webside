import { normalizeButtonLabel } from '../model/buttonAsset'
import type { EditorProjectState } from '../model/editorProject'

export function setButtonLabel(
  state: EditorProjectState,
  elementId: string,
  label: string,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)
  const normalizedLabel = normalizeButtonLabel(label)

  if (
    !activePage ||
    !element ||
    element.kind !== 'button' ||
    element.locked ||
    normalizedLabel === null ||
    normalizedLabel === element.label
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'button'
              ? { ...candidate, label: normalizedLabel }
              : candidate,
          ),
        }
      : page,
  )

  return {
    ...state,
    project: {
      ...state.project,
      pages,
      updatedAt,
    },
  }
}
