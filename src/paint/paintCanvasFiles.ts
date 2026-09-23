import type { SupportedImageMimeType } from '../model/imageAsset'

export async function canvasToFile(
  canvas: HTMLCanvasElement,
  name: string,
  mimeType: SupportedImageMimeType,
) {
  const output = document.createElement('canvas')
  output.width = canvas.width
  output.height = canvas.height
  const context = output.getContext('2d')
  if (!context) throw new Error('Bildeområdet er ikke tilgjengelig.')
  if (mimeType === 'image/jpeg') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, output.width, output.height)
  }
  context.drawImage(canvas, 0, 0)

  const blob = await new Promise<Blob>((resolve, reject) => {
    output.toBlob(
      (result) => result ? resolve(result) : reject(new Error('Kunne ikke lage bildefil.')),
      mimeType,
      0.92,
    )
  })
  return new File([blob], name, { type: mimeType })
}

type SaveHandle = {
  createWritable: () => Promise<{
    write: (file: File) => Promise<void>
    close: () => Promise<void>
    abort: () => Promise<void>
  }>
}

export async function saveCanvasWithPicker(
  canvas: HTMLCanvasElement,
  name: string,
  mimeType: SupportedImageMimeType,
) {
  const picker = (window as Window & {
    showSaveFilePicker?: (options: object) => Promise<SaveHandle>
  }).showSaveFilePicker

  if (!picker) {
    throw new Error('Nettleseren støtter ikke valg av lagringsmappe. Bruk Chrome eller Edge.')
  }

  const extension = mimeType === 'image/jpeg' ? '.jpg' :
    mimeType === 'image/webp' ? '.webp' : '.png'
  const handle = await picker.call(window, {
    suggestedName: name,
    types: [{ description: 'Bildefil', accept: { [mimeType]: [extension] } }],
  })
  const file = await canvasToFile(canvas, name, mimeType)
  const writable = await handle.createWritable()
  try {
    await writable.write(file)
    await writable.close()
  } catch (error) {
    await writable.abort()
    throw error
  }
}
