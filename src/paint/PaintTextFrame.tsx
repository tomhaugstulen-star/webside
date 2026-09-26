import { useRef, type PointerEvent } from 'react'
import type { Point } from './paintGeometry'

type Props = {
  value: string
  color: string
  fontSize: number
  position: Point
  canvasWidth: number
  canvasHeight: number
  displayWidth: number
  displayHeight: number
  onMove: (position: Point) => void
  onCommit: () => void
}

export function PaintTextFrame({
  value, color, fontSize, position, canvasWidth, canvasHeight,
  displayWidth, displayHeight, onMove, onCommit,
}: Props) {
  const dragRef = useRef<{ x: number; y: number; start: Point } | null>(null)
  const left = canvasWidth ? position.x / canvasWidth * displayWidth : 0
  const top = canvasHeight ? position.y / canvasHeight * displayHeight : 0
  const scale = canvasWidth ? displayWidth / canvasWidth : 1

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || !canvasWidth || !canvasHeight) return
    const dx = (event.clientX - drag.x) * canvasWidth / displayWidth
    const dy = (event.clientY - drag.y) * canvasHeight / displayHeight
    onMove({
      x: Math.max(0, Math.min(canvasWidth - 1, Math.round(drag.start.x + dx))),
      y: Math.max(0, Math.min(canvasHeight - 1, Math.round(drag.start.y + dy))),
    })
  }

  return (
    <div className="paint-text-frame" tabIndex={0} autoFocus
      aria-label="Tekstramme. Trykk Enter for å feste teksten."
      style={{ left, top, color, fontSize: Math.max(8, fontSize * scale) }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' || event.shiftKey) return
        event.preventDefault()
        onCommit()
      }}
      onPointerDown={(event) => {
        event.currentTarget.focus()
        event.currentTarget.setPointerCapture(event.pointerId)
        dragRef.current = { x: event.clientX, y: event.clientY, start: position }
      }}
      onPointerMove={move}
      onPointerUp={(event) => {
        move(event)
        dragRef.current = null
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      onPointerCancel={() => { dragRef.current = null }}>
      {value}
    </div>
  )
}
