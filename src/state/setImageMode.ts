import type {
  EditorProjectState,
  ImageEditorElement,
} from '../model/editorProject'
import {
  getImageCropSize,
  isImageMode,
  normalizeImageTransformForFrame,
  type ImageMode,
  type ImageTransform,
} from '../model/imagePresentation'

function getCropCompatibleElement(
  element: ImageEditorElement,
  transform: ImageTransform,
): ImageEditorElement {
  const currentSize = element.size.desktop
  const maximumSize = getImageCropSize(element.assetMetadata, transform)
  const nextSize = {
    width: Math.min(currentSize.width, maximumSize.width),
    height: Math.min(currentSize.height, maximumSize.height),
  }
  const nextPosition = {
    x: element.position.desktop.x + (currentSize.width - nextSize.width) / 2,
    y: element.position.desktop.y + (currentSize.height - nextSize.height) / 2,
  }

  return {
    ...element,
    mode: 'crop',
    transform,
    position: {
      ...element.position,
      desktop: nextPosition,
    },
    size: {
      ...element.size,
      desktop: nextSize,
    },
  }
}

export function setImageMode(
  state: EditorProjectState,
  elementId: string,
  mode: ImageMode,
  updatedAt: string,
): EditorProjectState {
  const activePage = state.project.pages.find((page) => page.id === state.activePageId)
  const element = activePage?.elements.find((candidate) => candidate.id === elementId)

  if (
    !activePage ||
    !element ||
    element.kind !== 'image' ||
    element.locked ||
    !isImageMode(mode) ||
    mode === element.mode
  ) {
    return state
  }

  const transform =
    mode === 'crop'
      ? normalizeImageTransformForFrame(
          element.transform,
          element.assetMetadata,
          element.size.desktop,
        ) ?? element.transform
      : element.transform
  const updatedElement =
    mode === 'crop'
      ? getCropCompatibleElement(element, transform)
      : { ...element, mode, transform }
  const pages = state.project.pages.map((page) =>
    page.id === state.activePageId
      ? {
          ...page,
          elements: page.elements.map((candidate) =>
            candidate.id === elementId && candidate.kind === 'image'
              ? updatedElement
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
