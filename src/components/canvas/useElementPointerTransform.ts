import {
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from 'react'
import {
  elementLayoutsEqual,
  moveElementLayout,
  resizeElementLayout,
  type ElementLayout,
  type ResizeHandle,
} from '../../model/elementLayout'
import type { EditorElement } from '../../model/editorProject'
import { autoScrollCanvasNearEdges } from './autoScrollCanvas'
import type { ElementLayoutPreview } from './canvasLayoutPreview'

type TransformMode = 'move' | 'resize'

type PointerInteraction = {
  pointerId: number
  mode: TransformMode
  resizeHandle: ResizeHandle
  startClientX: number
  startClientY: number
  startScrollLeft: number
  startScrollTop: number
  canvasWidth: number
  initialLayout: ElementLayout
}

type ElementPointerTransformOptions = {
  element: EditorElement
  initialLayout: ElementLayout
  canvasRef: RefObject<HTMLDivElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onSelect: (elementId: string) => void
  onCommitLayout: (elementId: string, layout: ElementLayout) => void
  onPreviewLayoutChange: (preview: ElementLayoutPreview | null) => void
}

export function useElementPointerTransform({
  element,
  initialLayout,
  canvasRef,
  scrollContainerRef,
  onSelect,
  onCommitLayout,
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
    if (event.button !== 0) {
      return
    }

    onSelect(element.id)

    if (element.locked) {
      return
    }

    const canvas = canvasRef.current
    const scrollContainer = scrollContainerRef.current

    if (!canvas || !scrollContainer || canvas.clientWidth <= 0) {
      return
    }

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

    if (!interaction || interaction.pointerId !== event.pointerId || !scrollContainer) {
      return
    }

    autoScrollCanvasNearEdges(scrollContainer, event.clientX, event.clientY)

    const delta = {
      x:
        event.clientX -
        interaction.startClientX +
        (scrollContainer.scrollLeft - interaction.startScrollLeft),
      y:
        event.clientY -
        interaction.startClientY +
        (scrollContainer.scrollTop - interaction.startScrollTop),
    }
    const nextLayout =
      interaction.mode === 'move'
        ? moveElementLayout(
            interaction.initialLayout,
            delta,
            interaction.canvasWidth,
          )
        : resizeElementLayout(
            element.kind,
            interaction.initialLayout,
            delta,
            interaction.canvasWidth,
            interaction.resizeHandle,
          )

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

    if (
      commit &&
      interaction &&
      finalLayout &&
      !elementLayoutsEqual(interaction.initialLayout, finalLayout)
    ) {
      onCommitLayout(element.id, finalLayout)
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
    if (interactionRef.current?.pointerId !== event.pointerId) {
      return
    }

    finishInteraction(false)
  }

  const handleLostPointerCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (interactionRef.current?.pointerId !== event.pointerId) {
      return
    }

    finishInteraction(false)
  }

  return {
    layout: draftLayout ?? initialLayout,
    transformMode,
    handleMovePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,
  }
}
