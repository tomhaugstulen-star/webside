import type {
  CSSProperties,
  KeyboardEvent,
  RefObject,
} from 'react'
import {
  moveElementLayout,
  resizeElementLayout,
  type ElementLayout,
} from '../../model/elementLayout'
import type { CanvasPosition, EditorElement } from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import { useElementLayout } from '../../state/useElementLayout'
import type { ViewportMode } from '../../types/editor'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import { useElementPointerTransform } from './useElementPointerTransform'

const elementKindLabels: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
}

const keyboardDirections: Partial<Record<string, CanvasPosition>> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

type EditorCanvasElementProps = {
  element: EditorElement
  viewport: ViewportMode
  selected: boolean
  canvasRef: RefObject<HTMLDivElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onSelect: (elementId: string) => void
  onPreviewLayoutChange: (preview: ElementLayoutPreview | null) => void
}

export function EditorCanvasElement({
  element,
  viewport,
  selected,
  canvasRef,
  scrollContainerRef,
  onSelect,
  onPreviewLayoutChange,
}: EditorCanvasElementProps) {
  const { commitElementDesktopLayout } = useElementLayout()
  const visible = resolveResponsiveValue(element.visibility, viewport)
  const initialLayout: ElementLayout = {
    position: resolveResponsiveValue(element.position, viewport),
    size: resolveResponsiveValue(element.size, viewport),
  }
  const {
    layout,
    transformMode,
    handleMovePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,
  } = useElementPointerTransform({
    element,
    initialLayout,
    canvasRef,
    scrollContainerRef,
    onSelect,
    onCommitLayout: commitElementDesktopLayout,
    onPreviewLayoutChange,
  })

  if (!visible) {
    return null
  }

  const label = elementKindLabels[element.kind]
  const style: CSSProperties = {
    left: layout.position.x,
    top: layout.position.y,
    width: layout.size.width,
    height: layout.size.height,
  }
  const transformClass = transformMode
    ? ` canvas-element--transforming canvas-element--${transformMode}`
    : ''

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(element.id)
      return
    }

    const direction = keyboardDirections[event.key]

    if (!direction) {
      return
    }

    event.preventDefault()
    onSelect(element.id)

    const canvas = canvasRef.current

    if (element.locked || !canvas || canvas.clientWidth <= 0) {
      return
    }

    const step = event.shiftKey ? 10 : 1
    const delta = {
      x: direction.x * step,
      y: direction.y * step,
    }
    const nextLayout =
      event.ctrlKey || event.metaKey
        ? resizeElementLayout(
            element.kind,
            initialLayout,
            delta,
            canvas.clientWidth,
          )
        : moveElementLayout(initialLayout, delta, canvas.clientWidth)

    commitElementDesktopLayout(element.id, nextLayout)
  }

  return (
    <div
      className={`canvas-element canvas-element--${element.kind} ${selected ? 'canvas-element--selected' : ''}${transformClass}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`${label}. Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse.`}
      aria-keyshortcuts="Enter Space ArrowUp ArrowDown ArrowLeft ArrowRight Control+ArrowUp Control+ArrowDown Control+ArrowLeft Control+ArrowRight Meta+ArrowUp Meta+ArrowDown Meta+ArrowLeft Meta+ArrowRight"
      aria-pressed={selected}
      data-element-id={element.id}
      onPointerDown={handleMovePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      onKeyDown={handleKeyDown}
    >
      <span className="canvas-element__placeholder" aria-hidden="true">
        {label}
      </span>
      {selected && !element.locked && (
        <span
          className="canvas-element__resize-handle"
          aria-hidden="true"
          onPointerDown={handleResizePointerDown}
        />
      )}
    </div>
  )
}
