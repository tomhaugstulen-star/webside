function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const paragraphs = text.split(/\n/)
  const lines: string[] = []

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      lines.push('')
      continue
    }

    let line = words[0]
    for (const word of words.slice(1)) {
      const candidate = `${line} ${word}`
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate
      } else {
        lines.push(line)
        line = word
      }
    }
    lines.push(line)
  }

  return lines
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result)
      else reject(new Error('Kunne ikke lage snapshot av bildet.'))
    }, 'image/png')
  })
}

export async function copyPaintSnapshot(
  canvas: HTMLCanvasElement,
  comment: string,
) {
  if (typeof ClipboardItem !== 'function' || !navigator.clipboard.write) {
    throw new Error('Nettleseren støtter ikke kopiering av bilde til utklippstavlen.')
  }

  const trimmedComment = comment.trim()
  if (!trimmedComment) {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': await canvasToPngBlob(canvas) }),
    ])
    return
  }

  const width = canvas.width
  const padding = Math.max(16, Math.round(width * 0.018))
  const fontSize = Math.max(14, Math.min(28, Math.round(width / 48)))
  const labelSize = Math.max(12, Math.round(fontSize * 0.72))
  const lineHeight = Math.round(fontSize * 1.42)
  const gap = Math.max(8, Math.round(fontSize * 0.55))
  const measureCanvas = document.createElement('canvas')
  const measure = measureCanvas.getContext('2d')
  if (!measure) throw new Error('Kunne ikke lage snapshot av bildet.')

  measure.font = `600 ${fontSize}px system-ui, sans-serif`
  const lines = wrapText(measure, trimmedComment, Math.max(1, width - padding * 2))
  const commentHeight =
    padding * 2 + labelSize + gap + Math.max(1, lines.length) * lineHeight

  const output = document.createElement('canvas')
  output.width = width
  output.height = canvas.height + commentHeight
  const context = output.getContext('2d')
  if (!context) throw new Error('Kunne ikke lage snapshot av bildet.')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, output.width, output.height)
  context.drawImage(canvas, 0, 0)

  const panelTop = canvas.height
  context.fillStyle = '#ffffff'
  context.fillRect(0, panelTop, width, commentHeight)
  context.fillStyle = '#d9dde3'
  context.fillRect(0, panelTop, width, 1)

  context.fillStyle = '#5f6875'
  context.font = `700 ${labelSize}px system-ui, sans-serif`
  context.fillText('INSTRUKSJON', padding, panelTop + padding + labelSize)

  context.fillStyle = '#17202c'
  context.font = `600 ${fontSize}px system-ui, sans-serif`
  const firstBaseline = panelTop + padding + labelSize + gap + fontSize
  lines.forEach((line, index) => {
    context.fillText(line, padding, firstBaseline + index * lineHeight)
  })

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': await canvasToPngBlob(output) }),
  ])
}
