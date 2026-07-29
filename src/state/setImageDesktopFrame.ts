import {
  elementLayoutsEqual,
  getElementDesktopLayout,
  isValidElementDesktopLayout,
  type ElementLayout,
} from '../model/elementLayout'
import type {
  EditorProjectState,
  ImageEditorElement,
} from '../model/editorProject'
import {
  imageTransformsEqual,
  normalizeImageTransformForFrame,
  type ImageTransform,
} from '../model/imagePresentation'

export function setImageDesktopFrame(
  state: EditorProjectState,
  elementId: string,
  layout: ElementLayout,
  transform: ImageTransform,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)
  const normalizedTransform =
    element?.kind === 'image' && element.mode === 'crop'
      ? normalizeImageTransformForFrame(
          transform,
          element.assetMetadata,
          layout.size,
        )
      : null

  if (
    !activePage ||
    !element ||
    element.kind !== 'image' ||
    element.mode !== 'crop' ||
    element.locked ||
    !normalizedTransform
  ) {
    return state
  }

  const updatedElement: ImageEditorElement = {
    ...element,
    position: {
      ...element.position,
      desktop: { ...layout.position },
    },
    size: {
      ...element.size,
      desktop: { ...layout.size },
    },
    transform: normalizedTransform,
  }

  if (
    !isValidElementDesktopLayout(updatedElement, layout) ||
    (elementLayoutsEqual(getElementDesktopLayout(element), layout) &&
      imageTransformsEqual(element.transform, normalizedTransform))
  ) {
    return state
  }

  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId ? updatedElement : candidate,
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
