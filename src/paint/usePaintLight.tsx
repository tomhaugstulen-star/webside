import { useState } from 'react'
import { prepareImageFile } from '../assets/images/prepareImageFile'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import type { ImageAssetResource } from '../assets/images/imageAssetStoreContext'
import type { ElementCreationRequest } from '../model/elementCreation'
import type { EditorElement } from '../model/editorProject'
import { createImageAssetId } from '../model/imageAsset'
import { PaintLightDialog } from './PaintLightDialog'
import { PaintImagePicker } from './PaintImagePicker'

type CreateElement = (request: ElementCreationRequest) => boolean

export function usePaintLight(selected: EditorElement | null, elements: readonly EditorElement[], createElement: CreateElement) {
  const [paintFile, setPaintFile] = useState<File | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [sourceDimensions, setSourceDimensions] = useState({ width: 0, height: 0 })
  const { getImageAsset, registerImageAsset, removeImageAsset } = useImageAssetStore()
  const assetId = selected?.kind === 'image' ? selected.assetId
    : selected?.kind === 'hero' ? selected.imageAssetId
      : selected?.kind === 'header' ? selected.logoAssetId : null
  const resource = assetId ? getImageAsset(assetId) : null
  const images = Array.from(new Set(elements.flatMap((element) => {
    if (element.kind === 'image') return [element.assetId]
    if (element.kind === 'hero') return [element.imageAssetId]
    if (element.kind === 'header') return [element.logoAssetId]
    return []
  }))).flatMap((id) => {
    const image = getImageAsset(id)
    return image ? [{ id, resource: image }] : []
  })

  const choose = (image: ImageAssetResource) => {
    setSourceDimensions(image.metadata)
    setPaintFile(image.file)
    setPickerOpen(false)
  }

  const createBlankProject = async () => {
    const width = 1200
    const height = 1200
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    )
    if (!blob) return
    setSourceDimensions({ width, height })
    setPaintFile(new File([blob], 'nytt-bilde.png', { type: 'image/png' }))
    setPickerOpen(false)
  }
  const open = () => {
    if (resource) choose(resource)
    else setPickerOpen(true)
  }

  const save = async (file: File) => {
    const prepared = await prepareImageFile(file)
    if (!prepared.ok) throw new Error(prepared.message)
    const newAssetId = createImageAssetId()
    if (!registerImageAsset(newAssetId, prepared.value.file, prepared.value.metadata)) {
      throw new Error('Det nye bildet kunne ikke lagres i prosjektet.')
    }
    const created = createElement({
      kind: 'image', assetId: newAssetId, assetMetadata: prepared.value.metadata,
    })
    if (!created) {
      removeImageAsset(newAssetId)
      throw new Error('Det nye bildet kunne ikke legges til på siden.')
    }
  }

  return {
    active: paintFile !== null || pickerOpen,
    open,
    dialog: pickerOpen ? (
      <PaintImagePicker
        images={images}
        onChoose={choose}
        onNew={() => void createBlankProject()}
        onClose={() => setPickerOpen(false)}
      />
    ) : paintFile ? (
      <PaintLightDialog file={paintFile} dimensions={sourceDimensions}
        onClose={() => setPaintFile(null)} onSave={save} />
    ) : null,
  }
}
