export function resizePaintCanvasBitmap(
  canvas: HTMLCanvasElement,
  overlay: HTMLCanvasElement,
  width: number,
  height: number,
) {
  const scratch = document.createElement('canvas')
  scratch.width = width
  scratch.height = height
  scratch.getContext('2d')?.drawImage(canvas, 0, 0, width, height)
  canvas.width = overlay.width = width
  canvas.height = overlay.height = height
  canvas.getContext('2d')?.drawImage(scratch, 0, 0)
}
