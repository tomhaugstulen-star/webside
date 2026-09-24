export async function copyPaintSnapshot(
  canvas: HTMLCanvasElement,
  comment: string,
) {
  if (typeof ClipboardItem !== 'function' || !navigator.clipboard.write) {
    throw new Error('Nettleseren støtter ikke kopiering av bilde til utklippstavlen.')
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result)
      else reject(new Error('Kunne ikke lage snapshot av bildet.'))
    }, 'image/png')
  })
  const clipboardData: Record<string, Blob> = { 'image/png': blob }
  const trimmedComment = comment.trim()

  if (trimmedComment) {
    clipboardData['text/plain'] = new Blob([trimmedComment], {
      type: 'text/plain',
    })
  }

  await navigator.clipboard.write([
    new ClipboardItem(clipboardData),
  ])
}
