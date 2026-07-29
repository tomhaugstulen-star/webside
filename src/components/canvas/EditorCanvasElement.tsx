import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react'
import type { ElementLayout } from '../../model/elementLayout'
import type { EditorElement } from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import { useElementLayout } from '../../state/useElementLayout'
import { useImageProperties } from '../../state/useImageProperties'
import { useTextElementContent } from '../../state/useTextElementContent'
import type { ViewportMode } from '../../types/editor'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import {
  getAccessibleElementLabel,
  getCanvasElementKeyboardShortcuts,
} from './canvasElementAccessibility'
import { handleCanvasElementKeyDown } from './canvasElementKeyboard'
import { EditorCanvasElementContent } from './EditorCanvasElementContent'
import { ElementSelectionToolbar } from './ElementSelectionToolbar'
import { getTextElementCssStyle } from './getTextElementCssStyle'
import { ImageResizeHandles } from './ImageResizeHandles'
import type { TextEditFinishReason } from './TextElementEditor'
import { useElementPointerTransform } from './useElementPointerTransform'

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
  const { updateImageTransform } = useImageProperties()
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
  const style: CSSProperties = {
    left: layout.position.x,
    top: layout.position.y,
    width: layout.size.width,
    height: layout.size.height,
    ...(element.kind === 'text' ? getTextElementCssStyle(element.textStyle) : {}),
  }
  const transformClass = transformMode
    ? ` canvas-element--transforming canvas-element--${transformMode}`
    : ''
  const lockedClass = element.locked ? ' canvas-element--locked' : ''
  const editingClass = isTextEditing ? ' canvas-element--editing' : ''
  const accessibleLabel = getAccessibleElementLabel(element)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    handleCanvasElementKeyDown(event, {
      element,
      selected,
      initialLayout,
      canvasWidth: canvasRef.current?.clientWidth ?? 0,
      onSelect,
      onStartTextEditing,
      onCommitLayout: commitElementDesktopLayout,
      onCommitImageTransform: updateImageTransform,
    })
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
            : getCanvasElementKeyboardShortcuts(element)
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
        <EditorCanvasElementContent
          element={element}
          editing={isTextEditing}
          selected={selected}
          frameSize={layout.size}
          onSelect={onSelect}
          onCommitText={(content) => commitTextElementContent(element.id, content)}
          onFinishTextEditing={finishTextEditing}
        />
        {selected && !element.locked && !isTextEditing && (
          element.kind === 'image' ? (
            <ImageResizeHandles onPointerDown={handleResizePointerDown} />
          ) : (
            <span
              className="canvas-element__resize-handle"
              aria-hidden="true"
              onPointerDown={(event) =>
                handleResizePointerDown('south-east', event)
              }
            />
          )
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
