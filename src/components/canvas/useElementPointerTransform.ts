import { useRef, useState, type PointerEvent, type RefObject } from 'react'
import {
  elementLayoutsEqual,
  type ElementLayout,
  type ResizeHandle,
} from '../../model/elementLayout'
import type { EditorElement } from '../../model/editorProject'
import type { ImageTransform } from '../../model/imagePresentation'
import { autoScrollCanvasNearEdges } from './autoScrollCanvas'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import {
  getNextPointerLayout,
  getPointerInteractionDelta,
  getResizedImageTransform,
  type PointerInteraction,
  type TransformMode,
} from './elementPointerTransform'

type ElementPointerTransformOptions = {
  element: EditorElement
  initialLayout: ElementLayout
  canvasRef: RefObject<HTMLDivElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onSelect: (elementId: string) => void
  onTransformStart: () => void
  onClickWithoutTransform: () => void
  onCommitLayout: (elementId: string, layout: ElementLayout) => void
  onCommitImageFrame: (
    elementId: string,
    layout: ElementLayout,
    transform: ImageTransform,
  ) => void
  onPreviewLayoutChange: (preview: ElementLayoutPreview | null) => void
}

export function useElementPointerTransform({
  element,
  initialLayout,
  canvasRef,
  scrollContainerRef,
  onSelect,
  onTransformStart,
  onClickWithoutTransform,
  onCommitLayout,
  onCommitImageFrame,
  onPreviewLayoutChange,
}: ElementPointerTransformOptions) {
  const [draftLayout, setDraftLayout] = useState<ElementLayout | null>(null)
  const [transformMode, setTransformMode] = useState<TransformMode | null>(null)
  const interactionRef = useRef<PointerInteraction | null>(null)
  const draftLayoutRef = useRef<ElementLayout | null>(null)

  const publishDraftLayout = (layout: ElementLayout | null) => {
    draftLayoutRef.current = layout
    setDraftLayout(layout)
    onPreviewLayoutChange(layout ? { elementId: element.id, layout } : null)
  }

  const startInteraction = (
    mode: TransformMode,
    event: PointerEvent<HTMLElement>,
    resizeHandle: ResizeHandle = 'south-east',
  ) => {
    if (event.button !== 0) return
    onSelect(element.id)

    if (element.locked) {
      onClickWithoutTransform()
      return
    }

    const canvas = canvasRef.current
    const scrollContainer = scrollContainerRef.current
    if (!canvas || !scrollContainer || canvas.clientWidth <= 0) {
      onClickWithoutTransform()
      return
    }

    onTransformStart()
    event.currentTarget.setPointerCapture(event.pointerId)
    interactionRef.current = {
      pointerId: event.pointerId,
      mode,
      resizeHandle,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScrollLeft: scrollContainer.scrollLeft,
      startScrollTop: scrollContainer.scrollTop,
      canvasWidth: canvas.clientWidth,
      initialLayout,
    }
    setTransformMode(mode)
    publishDraftLayout(initialLayout)
  }

  const handleMovePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation()
    startInteraction('move', event)
  }

  const handleResizePointerDown = (
    handle: ResizeHandle,
    event: PointerEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    startInteraction('resize', event, handle)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current
    const scrollContainer = scrollContainerRef.current
    if (
      !interaction ||
      interaction.pointerId !== event.pointerId ||
      !scrollContainer
    ) {
      return
    }

    autoScrollCanvasNearEdges(scrollContainer, event.clientX, event.clientY)
    const delta = getPointerInteractionDelta(
      interaction,
      event.clientX,
      event.clientY,
      scrollContainer.scrollLeft,
      scrollContainer.scrollTop,
    )
    const nextLayout = getNextPointerLayout(element, interaction, delta)

    if (
      draftLayoutRef.current &&
      elementLayoutsEqual(draftLayoutRef.current, nextLayout)
    ) {
      return
    }

    publishDraftLayout(nextLayout)
  }

  const finishInteraction = (commit: boolean) => {
    const interaction = interactionRef.current
    const finalLayout = draftLayoutRef.current
    interactionRef.current = null
    setTransformMode(null)
    publishDraftLayout(null)

    if (!commit || !interaction || !finalLayout) return
    if (elementLayoutsEqual(interaction.initialLayout, finalLayout)) {
      onClickWithoutTransform()
      return
    }

    const imageTransform =
      interaction.mode === 'resize'
        ? getResizedImageTransform(
            element,
            interaction.initialLayout,
            finalLayout,
          )
        : null

    if (imageTransform) {
      onCommitImageFrame(element.id, finalLayout, imageTransform)
    } else {
      onCommitLayout(element.id, finalLayout)
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (interactionRef.current?.pointerId !== event.pointerId) return
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
    layout: draftLayout ?? initialLayout,
    imageTransform:
      transformMode === 'resize' && draftLayout
        ? getResizedImageTransform(element, initialLayout, draftLayout)
        : null,
    transformMode,
    handleMovePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,
  }
}
