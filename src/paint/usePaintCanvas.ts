import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { drawMovedSelection, drawShape, drawStroke, movedSelectionPosition } from './paintDrawing'
import {
  containsPoint, fitSelection, selectionBetween,
  type PaintTool, type Point, type Selection,
} from './paintGeometry'
import { createPaintFillStyle, type PaintFill } from './paintFill'

type Snapshot = { data: string; width: number; height: number }
type Drag = {
  start: Point
  last: Point
  original: ImageData | null
  moving: boolean
  selection: Selection | null
  pixels: ImageData | null
}

export function usePaintCanvas(
  file: File,
  tool: PaintTool,
  color: string,
  size: number,
  textValue: string,
  textColor: string,
  textSize: number,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const historyRef = useRef<{ entries: Snapshot[]; index: number }>({ entries: [], index: -1 })
  const dragRef = useRef<Drag | null>(null)
  const clipboardRef = useRef<ImageData | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [ready, setReady] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [historyStatus, setHistoryStatus] = useState({ canUndo: false, canRedo: false })
  const [canPaste, setCanPaste] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const context = () => canvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null
  const clearOverlay = () => {
    const overlay = overlayRef.current
    overlay?.getContext('2d')?.clearRect(0, 0, overlay.width, overlay.height)
  }
  const showSelection = (area: Selection | null) => {
    clearOverlay()
    if (!area) return
    const ctx = overlayRef.current?.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.strokeRect(area.x + 0.5, area.y + 0.5, area.width, area.height)
    ctx.strokeStyle = '#17202c'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.strokeRect(area.x + 0.5, area.y + 0.5, area.width, area.height)
    ctx.setLineDash([])
  }
  const snapshot = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const history = historyRef.current
    const entries = history.entries.slice(0, history.index + 1)
    entries.push({ data: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height })
    historyRef.current = {
      entries: entries.slice(-12),
      index: Math.min(entries.length, 12) - 1,
    }
    setHistoryStatus({
      canUndo: historyRef.current.index > 0,
      canRedo: false,
    })
  }

  useEffect(() => {
    let active = true
    historyRef.current = { entries: [], index: -1 }
    void createImageBitmap(file).then((bitmap) => {
      if (!active) { bitmap.close(); return }
      const canvas = canvasRef.current
      const overlay = overlayRef.current
      if (!canvas || !overlay) { bitmap.close(); return }
      canvas.width = overlay.width = bitmap.width
      canvas.height = overlay.height = bitmap.height
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
      bitmap.close()
      setCanvasSize({ width: canvas.width, height: canvas.height })
      snapshot()
      setReady(true)
    }).catch(() => { if (active) setError('Bildet kunne ikke åpnes.') })
    return () => { active = false }
    // A new file starts a fresh editing history.
  }, [file])

  const pointFromEvent = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.round((event.clientX - bounds.left) * event.currentTarget.width / bounds.width),
      y: Math.round((event.clientY - bounds.top) * event.currentTarget.height / bounds.height),
    }
  }
  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!ready || event.button !== 0) return
    const start = pointFromEvent(event)
    if (tool === 'text') {
      const value = textValue.trim()
      const ctx = context()
      if (!value || !ctx) return
      ctx.save()
      ctx.fillStyle = textColor
      ctx.font = `600 ${textSize}px Arial, sans-serif`
      ctx.textBaseline = 'top'
      value.split('\n').forEach((line, index) => {
        ctx.fillText(line, start.x, start.y + index * Math.round(textSize * 1.2))
      })
      ctx.restore()
      snapshot()
      return
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    const canvas = canvasRef.current!
    const moving = tool === 'select' && !!selection && containsPoint(selection, start)
    dragRef.current = {
      start, last: start, moving, selection,
      pixels: moving && selection ? context()?.getImageData(
        selection.x, selection.y, selection.width, selection.height,
      ) ?? null : null,
      original: moving || tool === 'line' || tool === 'rectangle'
        ? context()?.getImageData(0, 0, canvas.width, canvas.height) ?? null
        : null,
    }
    if (tool === 'brush' || tool === 'eraser') drawStroke(context()!, start, start, color, size, tool === 'eraser')
    if (tool === 'select' && !moving) showSelection(null)
  }
  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const current = pointFromEvent(event)
    const canvas = canvasRef.current!
    const ctx = context()!
    if (tool === 'brush' || tool === 'eraser') {
      drawStroke(ctx, drag.last, current, color, size, tool === 'eraser')
    } else if (tool === 'select') {
      if (drag.moving && drag.selection && drag.original && drag.pixels) {
        const source = drag.selection
        const position = movedSelectionPosition(
          source, drag.start, current, canvas.width, canvas.height,
        )
        drawMovedSelection(ctx, drag.original, drag.pixels, source, position)
        showSelection({ ...source, ...position })
      } else {
        showSelection(fitSelection(selectionBetween(drag.start, current), canvas.width, canvas.height))
      }
    } else if (drag.original) {
      ctx.putImageData(drag.original, 0, 0)
      drawShape(ctx, tool, drag.start, current, color, size)
    }
    drag.last = current
  }
  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current
    if (!drag) return
    onPointerMove(event)
    dragRef.current = null
    if (tool === 'select') {
      const canvas = canvasRef.current!
      const area = drag.moving && drag.selection
        ? { ...drag.selection, ...movedSelectionPosition(
          drag.selection, drag.start, drag.last, canvas.width, canvas.height,
        ) }
        : fitSelection(selectionBetween(drag.start, drag.last), canvas.width, canvas.height)
      const chosen = area.width > 1 && area.height > 1 ? area : null
      setSelection(chosen)
      showSelection(chosen)
      if (drag.moving && chosen) snapshot()
    } else {
      snapshot()
    }
  }

  const copy = () => {
    if (!selection) return
    clipboardRef.current = context()?.getImageData(
      selection.x, selection.y, selection.width, selection.height,
    ) ?? null
    setCanPaste(clipboardRef.current !== null)
  }
  const cut = () => {
    if (!selection) return
    copy()
    context()?.clearRect(selection.x, selection.y, selection.width, selection.height)
    snapshot()
  }
  const paste = () => {
    const pixels = clipboardRef.current
    if (!pixels) return
    const canvas = canvasRef.current!
    const x = Math.max(0, Math.min((selection?.x ?? 0) + 16, canvas.width - pixels.width))
    const y = Math.max(0, Math.min((selection?.y ?? 0) + 16, canvas.height - pixels.height))
    context()?.putImageData(pixels, x, y)
    const area = { x, y, width: pixels.width, height: pixels.height }
    setSelection(area)
    showSelection(area)
    snapshot()
  }
  const crop = () => {
    if (!selection) return
    const canvas = canvasRef.current!
    const pixels = context()?.getImageData(
      selection.x, selection.y, selection.width, selection.height,
    )
    if (!pixels) return
    canvas.width = overlayRef.current!.width = selection.width
    canvas.height = overlayRef.current!.height = selection.height
    context()?.putImageData(pixels, 0, 0)
    setSelection(null)
    setCanvasSize({ width: canvas.width, height: canvas.height })
    snapshot()
  }
  const resize = (width: number, height: number) => {
    const canvas = canvasRef.current!
    const scratch = document.createElement('canvas')
    scratch.width = width
    scratch.height = height
    scratch.getContext('2d')?.drawImage(canvas, 0, 0, width, height)
    canvas.width = overlayRef.current!.width = width
    canvas.height = overlayRef.current!.height = height
    context()?.drawImage(scratch, 0, 0)
    setSelection(null)
    setCanvasSize({ width, height })
    snapshot()
  }
  const fillBackground = (fill: PaintFill) => {
    const canvas = canvasRef.current
    const ctx = context()
    if (!canvas || !ctx) return
    ctx.save()
    ctx.fillStyle = createPaintFillStyle(ctx, canvas.width, canvas.height, fill)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    setSelection(null)
    clearOverlay()
    snapshot()
  }

  const restore = async (index: number) => {
    const entry = historyRef.current.entries[index]
    if (!entry) return
    const image = new Image()
    image.src = entry.data
    await image.decode()
    const canvas = canvasRef.current!
    canvas.width = overlayRef.current!.width = entry.width
    canvas.height = overlayRef.current!.height = entry.height
    context()?.drawImage(image, 0, 0)
    historyRef.current.index = index
    setSelection(null)
    setCanvasSize({ width: entry.width, height: entry.height })
    setHistoryStatus({ canUndo: index > 0, canRedo: index < historyRef.current.entries.length - 1 })
  }
  return {
    canvasRef, overlayRef, ready, error, selection,
    width: canvasSize.width, height: canvasSize.height,
    canUndo: historyStatus.canUndo, canRedo: historyStatus.canRedo,
    undo: () => restore(historyRef.current.index - 1),
    redo: () => restore(historyRef.current.index + 1),
    copy, cut, paste, canPaste, crop, resize, fillBackground, commit: snapshot,
    clearSelection: () => { setSelection(null); showSelection(null) },
    onPointerDown, onPointerMove, onPointerUp,
  }
}
