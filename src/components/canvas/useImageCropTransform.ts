import { useRef, useState, type PointerEvent } from 'react'
import type { ImageEditorElement } from '../../model/editorProject'
import {
  imageTransformsEqual,
  moveImageTransform,
  type ImageFrameSize,
  type ImageTransform,
} from '../../model/imagePresentation'
import { useImageProperties } from '../../state/useImageProperties'

type CropInteraction = {
  pointerId: number
  startClientX: number
  startClientY: number
  initialTransform: ImageTransform
}

type ImageCropTransformOptions = {
  element: ImageEditorElement
  frameSize: ImageFrameSize
  enabled: boolean
  onSelect: (elementId: string) => void
}

export function useImageCropTransform({
  element,
  frameSize,
  enabled,
  onSelect,
}: ImageCropTransformOptions) {
  const { updateImageTransform } = useImageProperties()
  const [draftTransform, setDraftTransform] = useState<ImageTransform | null>(null)
  const interactionRef = useRef<CropInteraction | null>(null)
  const draftTransformRef = useRef<ImageTransform | null>(null)

  const publishDraft = (transform: ImageTransform | null) => {
    draftTransformRef.current = transform
    setDraftTransform(transform)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.button !== 0 || event.shiftKey) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    onSelect(element.id)
    event.currentTarget.setPointerCapture(event.pointerId)
    interactionRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      initialTransform: element.transform,
    }
    publishDraft(element.transform)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current

    if (!interaction || interaction.pointerId !== event.pointerId) {
      return
    }

    const nextTransform = moveImageTransform(
      element.assetMetadata,
      frameSize,
      interaction.initialTransform,
      event.clientX - interaction.startClientX,
      event.clientY - interaction.startClientY,
    )

    if (
      draftTransformRef.current &&
      imageTransformsEqual(draftTransformRef.current, nextTransform)
    ) {
      return
    }

    publishDraft(nextTransform)
  }

  const finishInteraction = (commit: boolean) => {
    const interaction = interactionRef.current
    const finalTransform = draftTransformRef.current
    interactionRef.current = null
    publishDraft(null)

    if (
      commit &&
      interaction &&
      finalTransform &&
      !imageTransformsEqual(interaction.initialTransform, finalTransform)
    ) {
      updateImageTransform(element.id, finalTransform)
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (interactionRef.current?.pointerId !== event.pointerId) {
      return
    }

    event.stopPropagation()
    finishInteraction(true)
  }

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (interactionRef.current?.pointerId === event.pointerId) {
      finishInteraction(false)
    }
  }

  const handleLostPointerCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (interactionRef.current?.pointerId === event.pointerId) {
      finishInteraction(false)
    }
  }

  return {
    transform: draftTransform ?? element.transform,
    dragging: draftTransform !== null,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,
  }
}
