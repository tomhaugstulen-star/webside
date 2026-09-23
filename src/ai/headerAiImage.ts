import type { HeaderEditorElement } from '../model/editorProject'
import type { ElementLayout } from '../model/elementLayout'
import { editorFillToCssBackground } from '../model/editorFill'

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Kunne ikke laste Header-logoen.'))
    image.src = source
  })
}

function canvasToPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Kunne ikke lage PNG av Headeren.'))
    }, 'image/png')
  })
}

function applyFill(
  context: CanvasRenderingContext2D,
  element: HeaderEditorElement,
  width: number,
  height: number,
) {
  const fill = element.appearance.backgroundFill

  if (fill.type === 'solid') {
    context.fillStyle = fill.color
  } else {
    const angle = fill.angle * Math.PI / 180
    const dx = Math.cos(angle) * width / 2
    const dy = Math.sin(angle) * height / 2
    const gradient = context.createLinearGradient(
      width / 2 - dx,
      height / 2 - dy,
      width / 2 + dx,
      height / 2 + dy,
    )
    gradient.addColorStop(0, fill.stops[0])
    gradient.addColorStop(1, fill.stops[1])
    context.fillStyle = gradient
  }

  context.fillRect(0, 0, width, height)
}

export async function renderHeaderAiPreviewPng(
  element: HeaderEditorElement,
  layout: ElementLayout,
  navigationLabels: readonly string[],
  logoUrl?: string,
) {
  const width = Math.max(1, Math.round(layout.size.width))
  const height = Math.max(1, Math.round(layout.size.height))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Nettleseren støtter ikke bildeeksport.')
  }

  applyFill(context, element, width, height)

  const frame = element.appearance.frame
  if (frame.width > 0) {
    context.strokeStyle = frame.color
    context.lineWidth = frame.width
    context.strokeRect(
      frame.width / 2,
      frame.width / 2,
      width - frame.width,
      height - frame.width,
    )
  }

  const padding = Math.max(12, Math.round(height * 0.14))
  const logoSize = Math.max(24, Math.min(64, height - padding * 2))
  let textX = padding

  if (logoUrl) {
    try {
      const logo = await loadImage(logoUrl)
      const ratio = Math.min(logoSize / logo.width, logoSize / logo.height)
      const logoWidth = logo.width * ratio
      const logoHeight = logo.height * ratio
      context.drawImage(
        logo,
        padding,
        (height - logoHeight) / 2,
        logoWidth,
        logoHeight,
      )
      textX = padding + logoWidth + 12
    } catch {
      textX = padding
    }
  }

  const fontFamily = element.appearance.fontFamily === 'system'
    ? 'system-ui, sans-serif'
    : element.appearance.fontFamily.replaceAll('-', ' ')
  context.fillStyle = element.appearance.textColor
  context.textBaseline = 'middle'
  context.font = `700 ${element.appearance.fontSize}px ${fontFamily}`
  context.fillText(element.siteName, textX, height * 0.42)

  if (element.subtitle) {
    context.font = `500 ${Math.max(11, element.appearance.fontSize * 0.55)}px ${fontFamily}`
    context.fillText(element.subtitle, textX, height * 0.68)
  }

  if (navigationLabels.length > 0) {
    context.font = `600 ${Math.max(11, element.appearance.fontSize * 0.52)}px ${fontFamily}`
    context.textAlign = 'right'
    context.fillText(navigationLabels.join('   '), width - padding, height / 2)
  }

  return canvasToPng(canvas)
}

export function describeHeaderAiPreview(element: HeaderEditorElement) {
  return editorFillToCssBackground(element.appearance.backgroundFill)
}
