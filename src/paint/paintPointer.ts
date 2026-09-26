import type { PointerEvent } from 'react'
import type { Point } from './paintGeometry'

export function paintPointFromEvent(
  event: PointerEvent<HTMLCanvasElement>,
): Point {
  const bounds = event.currentTarget.getBoundingClientRect()
  return {
    x: Math.round(
      (event.clientX - bounds.left) * event.currentTarget.width / bounds.width,
    ),
    y: Math.round(
      (event.clientY - bounds.top) * event.currentTarget.height / bounds.height,
    ),
  }
}
