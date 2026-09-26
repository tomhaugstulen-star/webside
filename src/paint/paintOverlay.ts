import type { Selection } from './paintGeometry'

export function clearPaintOverlay(canvas: HTMLCanvasElement | null) {
  if (!canvas) return
  canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
}

export function drawSelectionOverlay(
  canvas: HTMLCanvasElement | null,
  area: Selection | null,
) {
  clearPaintOverlay(canvas)
  if (!canvas || !area) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.strokeRect(area.x + 0.5, area.y + 0.5, area.width, area.height)
  ctx.strokeStyle = '#17202c'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  ctx.strokeRect(area.x + 0.5, area.y + 0.5, area.width, area.height)
  ctx.setLineDash([])

  const handle = Math.max(10, Math.round(Math.min(canvas.width, canvas.height) / 90))
  const half = handle / 2
  const points = [
    [area.x, area.y],
    [area.x + area.width, area.y],
    [area.x, area.y + area.height],
    [area.x + area.width, area.y + area.height],
  ]
  for (const [x, y] of points) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x - half, y - half, handle, handle)
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 2
    ctx.strokeRect(x - half, y - half, handle, handle)
  }
}

export function drawRectangleMeasurement(
  canvas: HTMLCanvasElement | null,
  area: Selection,
) {
  clearPaintOverlay(canvas)
  if (!canvas || area.width < 1 || area.height < 1) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const scale = Math.max(1, canvas.width / 1000)
  const fontSize = Math.max(14, Math.round(15 * scale))
  const paddingX = Math.round(8 * scale)
  const paddingY = Math.round(5 * scale)
  const label = `${area.width} × ${area.height} px`

  ctx.font = `600 ${fontSize}px Arial, sans-serif`
  const width = Math.ceil(ctx.measureText(label).width + paddingX * 2)
  const height = fontSize + paddingY * 2
  const x = Math.max(0, Math.min(canvas.width - width, area.x))
  const y = Math.max(0, area.y - height - Math.round(6 * scale))

  ctx.fillStyle = 'rgba(23, 32, 44, 0.92)'
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, Math.round(6 * scale))
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'top'
  ctx.fillText(label, x + paddingX, y + paddingY)
}
