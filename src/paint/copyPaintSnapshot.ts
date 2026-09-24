export async function copyPaintSnapshot(canvas: HTMLCanvasElement) {
  if (typeof ClipboardItem !== 'function' || !navigator.clipboard.write) {
    throw new Error('Nettleseren støtter ikke kopiering av bilde til utklippstavlen.')
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result)
      else reject(new Error('Kunne ikke lage snapshot av bildet.'))
    }, 'image/png')
  })

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
}
