export type PaintTool = 'select' | 'brush' | 'eraser' | 'line' | 'rectangle' | 'text'
export type Point = { x: number; y: number }
export type Selection = { x: number; y: number; width: number; height: number }

export function selectionBetween(first: Point, second: Point): Selection {
  const x = Math.min(first.x, second.x)
  const y = Math.min(first.y, second.y)
  return {
    x,
    y,
    width: Math.abs(second.x - first.x),
    height: Math.abs(second.y - first.y),
  }
}

export function containsPoint(selection: Selection, point: Point) {
  return point.x >= selection.x && point.x < selection.x + selection.width &&
    point.y >= selection.y && point.y < selection.y + selection.height
}

export function fitSelection(selection: Selection, width: number, height: number) {
  const x = Math.max(0, Math.min(Math.round(selection.x), width - 1))
  const y = Math.max(0, Math.min(Math.round(selection.y), height - 1))
  return {
    x,
    y,
    width: Math.max(0, Math.min(Math.round(selection.width), width - x)),
    height: Math.max(0, Math.min(Math.round(selection.height), height - y)),
  }
}

export function validDimensions(width: number, height: number) {
  return Number.isInteger(width) && Number.isInteger(height) &&
    width > 0 && height > 0 && width <= 16_384 && height <= 16_384 &&
    width * height <= 40_000_000
}
