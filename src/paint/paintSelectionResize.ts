import type { Point, Selection } from './paintGeometry'

export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se'

function handlePoint(selection: Selection, handle: ResizeHandle): Point {
  return {
    x: handle.includes('e') ? selection.x + selection.width : selection.x,
    y: handle.includes('s') ? selection.y + selection.height : selection.y,
  }
}

export function resizeHandleAtPoint(
  selection: Selection,
  point: Point,
  radius: number,
): ResizeHandle | null {
  const handles: ResizeHandle[] = ['nw', 'ne', 'sw', 'se']
  return handles.find((handle) => {
    const target = handlePoint(selection, handle)
    return Math.abs(point.x - target.x) <= radius &&
      Math.abs(point.y - target.y) <= radius
  }) ?? null
}

export function resizedSelection(
  source: Selection,
  handle: ResizeHandle,
  current: Point,
  canvasWidth: number,
  canvasHeight: number,
): Selection {
  const anchor = handlePoint(source, ({
    nw: 'se', ne: 'sw', sw: 'ne', se: 'nw',
  } as const)[handle])
  const ratio = source.width / Math.max(1, source.height)
  const rawWidth = Math.max(4, Math.abs(current.x - anchor.x))
  const rawHeight = Math.max(4, Math.abs(current.y - anchor.y))
  const scale = Math.max(rawWidth / source.width, rawHeight / source.height)
  let width = Math.max(4, Math.round(source.width * scale))
  let height = Math.max(4, Math.round(width / ratio))

  width = Math.min(width, handle.includes('e') ? canvasWidth - anchor.x : anchor.x)
  height = Math.min(height, handle.includes('s') ? canvasHeight - anchor.y : anchor.y)
  const constrainedScale = Math.min(width / source.width, height / source.height)
  width = Math.max(4, Math.round(source.width * constrainedScale))
  height = Math.max(4, Math.round(source.height * constrainedScale))

  return {
    x: handle.includes('e') ? anchor.x : anchor.x - width,
    y: handle.includes('s') ? anchor.y : anchor.y - height,
    width,
    height,
  }
}

export function drawResizedSelection(
  ctx: CanvasRenderingContext2D,
  original: ImageData,
  pixels: ImageData,
  source: Selection,
  target: Selection,
) {
  ctx.putImageData(original, 0, 0)
  const scratch = document.createElement('canvas')
  scratch.width = source.width
  scratch.height = source.height
  scratch.getContext('2d')!.putImageData(pixels, 0, 0)
  ctx.clearRect(source.x, source.y, source.width, source.height)
  ctx.drawImage(
    scratch, 0, 0, source.width, source.height,
    target.x, target.y, target.width, target.height,
  )
}
