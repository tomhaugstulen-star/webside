import type {
  CSSProperties,
  KeyboardEvent,
  RefObject,
} from 'react'
import type { ElementLayout } from '../../model/elementLayout'
import type { EditorElement } from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import { useElementLayout } from '../../state/useElementLayout'
import type { ViewportMode } from '../../types/editor'
import {
  useElementPointerTransform,
  type ElementLayoutPreview,
} from './useElementPointerTransform'

const elementKindLabels: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
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

  if (!visible) {
    return null
  }

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
  } = useElementPointerTransform({
    element,
    initialLayout,
    canvasRef,
    scrollContainerRef,
    onSelect,
    onCommitLayout: commitElementDesktopLayout,
    onPreviewLayoutChange,
  })
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
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    onSelect(element.id)
  }

  return (
    <div
      className={`canvas-element canvas-element--${element.kind} ${selected ? 'canvas-element--selected' : ''}${transformClass}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Velg ${label.toLowerCase()}`}
      aria-pressed={selected}
      data-element-id={element.id}
      onPointerDown={handleMovePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
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
