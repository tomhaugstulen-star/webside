import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react'
import {
  moveElementLayout,
  resizeElementLayout,
  type ElementLayout,
} from '../../model/elementLayout'
import type { CanvasPosition, EditorElement } from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import { useElementLayout } from '../../state/useElementLayout'
import { useTextElementContent } from '../../state/useTextElementContent'
import type { ViewportMode } from '../../types/editor'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import { ElementSelectionToolbar } from './ElementSelectionToolbar'
import {
  TextElementEditor,
  type TextEditFinishReason,
} from './TextElementEditor'
import { useElementPointerTransform } from './useElementPointerTransform'

const elementKindLabels: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekstboks',
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
  editing: boolean
  canvasRef: RefObject<HTMLDivElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onSelect: (elementId: string) => void
  onStartTextEditing: (elementId: string) => void
  onFinishTextEditing: (elementId: string) => void
  onPreviewLayoutChange: (preview: ElementLayoutPreview | null) => void
}

function getAccessibleElementLabel(element: EditorElement) {
  const kindLabel = elementKindLabels[element.kind]

  if (element.locked) {
    return `${kindLabel}, låst. Bruk objektverktøyet for å låse opp.`
  }

  if (element.kind === 'text') {
    const summary = element.content.trim().replace(/\s+/g, ' ').slice(0, 80)
    const contentLabel = summary ? `Innhold: ${summary}.` : 'Tom tekstboks.'
    return `${contentLabel} Dobbeltklikk eller trykk Enter når elementet er markert for å redigere. Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse.`
  }

  return `${kindLabel}. Piltaster flytter. Control eller Command sammen med piltaster endrer størrelse.`
}

export function EditorCanvasElement({
  element,
  viewport,
  selected,
  editing,
  canvasRef,
  scrollContainerRef,
  onSelect,
  onStartTextEditing,
  onFinishTextEditing,
  onPreviewLayoutChange,
}: EditorCanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const { commitElementDesktopLayout } = useElementLayout()
  const { commitTextElementContent } = useTextElementContent()
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

  const isTextEditing = editing && element.kind === 'text'
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
  const lockedClass = element.locked ? ' canvas-element--locked' : ''
  const editingClass = isTextEditing ? ' canvas-element--editing' : ''
  const accessibleLabel = getAccessibleElementLabel(element)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      if (element.kind === 'text' && selected && !element.locked) {
        onStartTextEditing(element.id)
      } else {
        onSelect(element.id)
      }

      return
    }

    if (event.key === ' ') {
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

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (element.kind !== 'text' || element.locked) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    onStartTextEditing(element.id)
  }

  const finishTextEditing = (reason: TextEditFinishReason) => {
    onFinishTextEditing(element.id)

    if (reason !== 'blur') {
      requestAnimationFrame(() => elementRef.current?.focus())
    }
  }

  return (
    <>
      <div
        ref={elementRef}
        className={`canvas-element canvas-element--${element.kind} ${selected ? 'canvas-element--selected' : ''}${transformClass}${lockedClass}${editingClass}`}
        style={style}
        role={isTextEditing ? undefined : 'button'}
        tabIndex={isTextEditing ? -1 : 0}
        aria-label={isTextEditing ? undefined : accessibleLabel}
        aria-keyshortcuts={
          isTextEditing
            ? undefined
            : element.locked
              ? 'Enter Space'
              : 'Enter Space ArrowUp ArrowDown ArrowLeft ArrowRight Control+ArrowUp Control+ArrowDown Control+ArrowLeft Control+ArrowRight Meta+ArrowUp Meta+ArrowDown Meta+ArrowLeft Meta+ArrowRight'
        }
        aria-pressed={isTextEditing ? undefined : selected}
        data-element-id={element.id}
        onPointerDown={isTextEditing ? undefined : handleMovePointerDown}
        onPointerMove={isTextEditing ? undefined : handlePointerMove}
        onPointerUp={isTextEditing ? undefined : handlePointerUp}
        onPointerCancel={isTextEditing ? undefined : handlePointerCancel}
        onLostPointerCapture={isTextEditing ? undefined : handleLostPointerCapture}
        onDoubleClick={isTextEditing ? undefined : handleDoubleClick}
        onKeyDown={isTextEditing ? undefined : handleKeyDown}
      >
        {element.kind === 'text' ? (
          isTextEditing ? (
            <TextElementEditor
              initialContent={element.content}
              onCommit={(content) => commitTextElementContent(element.id, content)}
              onFinish={finishTextEditing}
            />
          ) : (
            <span
              className={`canvas-element__text-content ${element.content ? '' : 'canvas-element__text-content--empty'}`}
              aria-hidden="true"
            >
              {element.content || 'Dobbeltklikk for å skrive'}
            </span>
          )
        ) : (
          <span className="canvas-element__placeholder" aria-hidden="true">
            {label}
          </span>
        )}
        {selected && !element.locked && !isTextEditing && (
          <span
            className="canvas-element__resize-handle"
            aria-hidden="true"
            onPointerDown={handleResizePointerDown}
          />
        )}
      </div>
      {selected && transformMode === null && !isTextEditing && (
        <ElementSelectionToolbar
          elementId={element.id}
          locked={element.locked}
          layout={layout}
        />
      )}
    </>
  )
}
