export type PaintFill =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; colors: [string, string, string]; angle: number }

export function createPaintFillStyle(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  fill: PaintFill,
): string | CanvasGradient {
  if (fill.type === 'solid') return fill.color

  const radians = ((fill.angle - 90) * Math.PI) / 180
  const centerX = width / 2
  const centerY = height / 2
  const length = Math.abs(width * Math.cos(radians)) +
    Math.abs(height * Math.sin(radians))
  const dx = Math.cos(radians) * length / 2
  const dy = Math.sin(radians) * length / 2
  const gradient = context.createLinearGradient(
    centerX - dx, centerY - dy, centerX + dx, centerY + dy,
  )
  gradient.addColorStop(0, fill.colors[0])
  gradient.addColorStop(0.5, fill.colors[1])
  gradient.addColorStop(1, fill.colors[2])
  return gradient
}
