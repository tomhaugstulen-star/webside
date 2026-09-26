import type { PointerEventHandler, RefObject } from 'react'

type Props = {
  viewportRef: RefObject<HTMLDivElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  overlayRef: RefObject<HTMLCanvasElement | null>
  importOverlayRef: RefObject<HTMLCanvasElement | null>
  width: number
  height: number
  importPending: boolean
  onPointerDown: PointerEventHandler<HTMLCanvasElement>
  onPointerMove: PointerEventHandler<HTMLCanvasElement>
  onPointerUp: PointerEventHandler<HTMLCanvasElement>
  onImportPointerDown: PointerEventHandler<HTMLCanvasElement>
  onImportPointerMove: PointerEventHandler<HTMLCanvasElement>
  onImportPointerUp: PointerEventHandler<HTMLCanvasElement>
}

export function PaintCanvasViewport({
  viewportRef, canvasRef, overlayRef, importOverlayRef, width, height,
  importPending, onPointerDown, onPointerMove, onPointerUp,
  onImportPointerDown, onImportPointerMove, onImportPointerUp,
}: Props) {
  return (
    <div ref={viewportRef} className="paint-dialog__canvas-scroll">
      <div className="paint-dialog__canvas-wrap" style={{ width, height }}>
        <canvas ref={canvasRef} aria-label="Bildearbeidsflate"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp} />
        <canvas ref={overlayRef} aria-hidden="true" />
        <canvas ref={importOverlayRef} className="paint-dialog__import-overlay"
          aria-label="Flytt importert bilde"
          style={{ pointerEvents: importPending ? 'auto' : 'none' }}
          onPointerDown={onImportPointerDown} onPointerMove={onImportPointerMove}
          onPointerUp={onImportPointerUp} onPointerCancel={onImportPointerUp} />
      </div>
    </div>
  )
}
