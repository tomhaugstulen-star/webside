import {
  isValidElementDesktopLayout,
  type ElementLayout,
  type ResizeHandle,
} from '../../model/elementLayout'
import type { EditorElement } from '../../model/editorProject'
import type { AlignmentGuide } from './alignmentGuideTypes'
import type { ResizeSizeTarget } from './resizeSizeTargets'
import { ALIGNMENT_SNAP_THRESHOLD } from './snapElementMove'

type SizeDimension = 'width' | 'height'

type SnapElementResizeOptions = {
  element: EditorElement
  layout: ElementLayout
  handle: ResizeHandle
  targets: ResizeSizeTarget[]
  canvasWidth: number
  threshold?: number
}

type SizeMatch = {
  target: ResizeSizeTarget
  distance: number
  proximity: number
}

function getSize(layout: ElementLayout, dimension: SizeDimension) {
  return dimension === 'width' ? layout.size.width : layout.size.height
}

function getCrossAxisCenter(layout: ElementLayout, dimension: SizeDimension) {
  return dimension === 'width'
    ? layout.position.y + layout.size.height / 2
    : layout.position.x + layout.size.width / 2
}

function findBestSizeMatch(
  layout: ElementLayout,
  targets: ResizeSizeTarget[],
  dimension: SizeDimension,
  threshold: number,
) {
  let bestMatch: SizeMatch | null = null

  for (const target of targets) {
    const distance = Math.abs(
      getSize(target.layout, dimension) - getSize(layout, dimension),
    )
    if (distance > threshold) continue

    const proximity = Math.abs(
      getCrossAxisCenter(target.layout, dimension) -
        getCrossAxisCenter(layout, dimension),
    )
    const candidate = { target, distance, proximity }

    if (
      !bestMatch ||
      candidate.distance < bestMatch.distance ||
      (candidate.distance === bestMatch.distance &&
        candidate.proximity < bestMatch.proximity) ||
      (candidate.distance === bestMatch.distance &&
        candidate.proximity === bestMatch.proximity &&
        candidate.target.elementId < bestMatch.target.elementId)
    ) {
      bestMatch = candidate
    }
  }

  return bestMatch?.target ?? null
}

function layoutFits(
  element: EditorElement,
  layout: ElementLayout,
  canvasWidth: number,
) {
  return (
    layout.position.x + layout.size.width <= canvasWidth &&
    isValidElementDesktopLayout(element, layout)
  )
}

function snapWidth(
  element: EditorElement,
  layout: ElementLayout,
  handle: ResizeHandle,
  target: ResizeSizeTarget,
  canvasWidth: number,
) {
  const right = layout.position.x + layout.size.width
  const width = target.layout.size.width
  const nextLayout: ElementLayout = {
    position: {
      ...layout.position,
      x: handle.includes('west') ? right - width : layout.position.x,
    },
    size: { ...layout.size, width },
  }

  return layoutFits(element, nextLayout, canvasWidth) ? nextLayout : layout
}

function snapHeight(
  element: EditorElement,
  layout: ElementLayout,
  handle: ResizeHandle,
  target: ResizeSizeTarget,
  canvasWidth: number,
) {
  const bottom = layout.position.y + layout.size.height
  const height = target.layout.size.height
  const nextLayout: ElementLayout = {
    position: {
      ...layout.position,
      y: handle.includes('north') ? bottom - height : layout.position.y,
    },
    size: { ...layout.size, height },
  }

  return layoutFits(element, nextLayout, canvasWidth) ? nextLayout : layout
}

function createWidthGuides(
  layout: ElementLayout,
  target: ResizeSizeTarget,
): AlignmentGuide[] {
  const start = Math.min(layout.position.y, target.layout.position.y)
  const end = Math.max(
    layout.position.y + layout.size.height,
    target.layout.position.y + target.layout.size.height,
  )

  return [layout.position.x, layout.position.x + layout.size.width].map(
    (coordinate) => ({
      axis: 'x' as const,
      coordinate,
      start,
      end,
      source: 'element' as const,
      targetElementId: target.elementId,
    }),
  )
}

function createHeightGuides(
  layout: ElementLayout,
  target: ResizeSizeTarget,
): AlignmentGuide[] {
  const start = Math.min(layout.position.x, target.layout.position.x)
  const end = Math.max(
    layout.position.x + layout.size.width,
    target.layout.position.x + target.layout.size.width,
  )

  return [layout.position.y, layout.position.y + layout.size.height].map(
    (coordinate) => ({
      axis: 'y' as const,
      coordinate,
      start,
      end,
      source: 'element' as const,
      targetElementId: target.elementId,
    }),
  )
}

export function snapElementResize({
  element,
  layout,
  handle,
  targets,
  canvasWidth,
  threshold = ALIGNMENT_SNAP_THRESHOLD,
}: SnapElementResizeOptions) {
  const widthTarget =
    handle.includes('east') || handle.includes('west')
      ? findBestSizeMatch(layout, targets, 'width', threshold)
      : null
  const heightTarget =
    handle.includes('north') || handle.includes('south')
      ? findBestSizeMatch(layout, targets, 'height', threshold)
      : null

  let snappedLayout = layout
  if (widthTarget) {
    snappedLayout = snapWidth(
      element,
      snappedLayout,
      handle,
      widthTarget,
      canvasWidth,
    )
  }
  if (heightTarget) {
    snappedLayout = snapHeight(
      element,
      snappedLayout,
      handle,
      heightTarget,
      canvasWidth,
    )
  }

  const guides: AlignmentGuide[] = []
  if (widthTarget && snappedLayout.size.width === widthTarget.layout.size.width) {
    guides.push(...createWidthGuides(snappedLayout, widthTarget))
  }
  if (
    heightTarget &&
    snappedLayout.size.height === heightTarget.layout.size.height
  ) {
    guides.push(...createHeightGuides(snappedLayout, heightTarget))
  }

  return { layout: snappedLayout, guides }
}
