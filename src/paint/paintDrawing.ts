import { selectionBetween, type PaintTool, type Point, type Selection } from './paintGeometry'

export function movedSelectionPosition(
  selection: Selection, start: Point, current: Point, width: number, height: number,
) {
  return {
    x: Math.max(0, Math.min(selection.x + current.x - start.x, width - selection.width)),
    y: Math.max(0, Math.min(selection.y + current.y - start.y, height - selection.height)),
  }
}

export function drawMovedSelection(
  ctx: CanvasRenderingContext2D,
  original: ImageData,
  pixels: ImageData,
  selection: Selection,
  position: Point,
) {
  ctx.putImageData(original, 0, 0)
  const scratch = document.createElement('canvas')
  scratch.width = selection.width
  scratch.height = selection.height
  scratch.getContext('2d')!.putImageData(pixels, 0, 0)
  ctx.clearRect(selection.x, selection.y, selection.width, selection.height)
  ctx.drawImage(scratch, position.x, position.y)
}

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
  size: number,
  erase: boolean,
) {
  ctx.save()
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over'
  ctx.strokeStyle = color
  ctx.lineWidth = size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  ctx.restore()
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  tool: PaintTool,
  from: Point,
  to: Point,
  color: string,
  size: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = size
  ctx.lineCap = 'round'
  if (tool === 'line') {
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  } else {
    const area = selectionBetween(from, to)
    ctx.strokeRect(area.x, area.y, area.width, area.height)
  }
}
