import { useState } from 'react'
import { prepareImageFile } from '../assets/images/prepareImageFile'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import type { ElementCreationRequest } from '../model/elementCreation'
import type { EditorElement } from '../model/editorProject'
import { createImageAssetId } from '../model/imageAsset'
import { PaintLightDialog } from './PaintLightDialog'

type CreateElement = (request: ElementCreationRequest) => boolean

export function usePaintLight(selected: EditorElement | null, createElement: CreateElement) {
  const [paintFile, setPaintFile] = useState<File | null>(null)
  const [sourceDimensions, setSourceDimensions] = useState({ width: 0, height: 0 })
  const { getImageAsset, registerImageAsset, removeImageAsset } = useImageAssetStore()
  const assetId = selected?.kind === 'image' ? selected.assetId
    : selected?.kind === 'hero' ? selected.imageAssetId
      : selected?.kind === 'header' ? selected.logoAssetId : null
  const resource = assetId ? getImageAsset(assetId) : null

  const open = () => {
    if (!resource) return
    setSourceDimensions(resource.metadata)
    setPaintFile(resource.file)
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
    active: paintFile !== null,
    canEdit: resource !== null,
    open,
    dialog: paintFile ? (
      <PaintLightDialog file={paintFile} dimensions={sourceDimensions}
        onClose={() => setPaintFile(null)} onSave={save} />
    ) : null,
  }
}
