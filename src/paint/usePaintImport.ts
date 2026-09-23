import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { prepareImageFile } from '../assets/images/prepareImageFile'
import { containsPoint, type Selection } from './paintGeometry'

type Imported = { bitmap: ImageBitmap; area: Selection }

export function usePaintImport(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  width: number, height: number, commit: () => void,
) {
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const importedRef = useRef<Imported | null>(null)
  const dragRef = useRef<{ x: number; y: number; area: Selection } | null>(null)
  const [imported, setImported] = useState(false)

  const render = () => {
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.width = width
    overlay.height = height
    const ctx = overlay.getContext('2d')
    const item = importedRef.current
    if (!ctx || !item) return
    const { x, y, width: w, height: h } = item.area
    ctx.drawImage(item.bitmap, x, y, w, h)
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = Math.max(2, width / 500)
    ctx.strokeRect(x, y, w, h)
  }
  useEffect(render, [width, height, imported])
  useEffect(() => () => { importedRef.current?.bitmap.close() }, [])

  const importFile = async (file: File) => {
    if (!width || !height || importedRef.current) return
    const prepared = await prepareImageFile(file)
    if (!prepared.ok) throw new Error(prepared.message)
    const bitmap = await createImageBitmap(prepared.value.file)
    const ratio = Math.min(1, width * 0.8 / bitmap.width, height * 0.8 / bitmap.height)
    const w = Math.max(1, Math.round(bitmap.width * ratio))
    const h = Math.max(1, Math.round(bitmap.height * ratio))
    importedRef.current = {
      bitmap,
      area: { x: Math.floor((width - w) / 2), y: Math.floor((height - h) / 2), width: w, height: h },
    }
    setImported(true)
  }
  const cancel = () => {
    importedRef.current?.bitmap.close()
    importedRef.current = null
    setImported(false)
    overlayRef.current?.getContext('2d')?.clearRect(0, 0, width, height)
  }
  const merge = () => {
    const item = importedRef.current
    const canvas = canvasRef.current
    if (!item || !canvas) return
    const { x, y, width: w, height: h } = item.area
    canvas.getContext('2d')?.drawImage(item.bitmap, x, y, w, h)
    cancel()
    commit()
  }
  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.round((event.clientX - bounds.left) * width / bounds.width),
      y: Math.round((event.clientY - bounds.top) * height / bounds.height),
    }
  }
  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const item = importedRef.current
    if (!item || event.button !== 0) return
    const { x, y } = point(event)
    if (!containsPoint(item.area, { x, y })) return
    dragRef.current = { x, y, area: { ...item.area } }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const item = importedRef.current
    const drag = dragRef.current
    if (!item || !drag) return
    const current = point(event)
    item.area = {
      ...drag.area,
      x: Math.max(0, Math.min(width - drag.area.width, drag.area.x + current.x - drag.x)),
      y: Math.max(0, Math.min(height - drag.area.height, drag.area.y + current.y - drag.y)),
    }
    render()
  }
  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    onPointerMove(event)
    dragRef.current = null
  }
  return { overlayRef, imported, importFile, cancel, merge, onPointerDown, onPointerMove, onPointerUp }
}
