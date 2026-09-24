import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from 'react'
import { useElementAiContextMenu } from '../../ai/useElementAiContextMenu'
import type { ElementLayout } from '../../model/elementLayout'
import type { EditorElement } from '../../model/editorProject'
import type { NavigationTarget } from '../../model/navigation'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import { resolveResponsiveElementLayout } from '../../model/resolveResponsiveElementLayout'
import { useElementLayout } from '../../state/useElementLayout'
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
import { getElementAppearanceCssStyle } from './getElementAppearanceCssStyle'
import { getTextElementCssStyle } from './getTextElementCssStyle'
import { ImageResizeHandles } from './ImageResizeHandles'
import type { TextEditFinishReason } from './TextElementEditor'
import { useElementPointerTransform } from './useElementPointerTransform'

type EditorCanvasElementProps = {
  element: EditorElement
  pageElements: EditorElement[]
  viewport: ViewportMode
  canvasWidth: number
  selected: boolean
  editing: boolean
  canvasRef: RefObject<HTMLDivElement | null>
  scrollContainerRef: RefObject<HTMLDivElement | null>
  onSelect: (elementId: string) => void
  onOpenProperties: () => void
  onCloseProperties: () => void
  onStartTextEditing: (elementId: string) => void
  onFinishTextEditing: (elementId: string) => void
  onPreviewLayoutChange: (preview: ElementLayoutPreview | null) => void
  onNavigate: (target: NavigationTarget) => void
}

export function EditorCanvasElement({
  element,
  pageElements,
  viewport,
  canvasWidth,
  selected,
  editing,
  canvasRef,
  scrollContainerRef,
  onSelect,
  onOpenProperties,
  onCloseProperties,
  onStartTextEditing,
  onFinishTextEditing,
  onPreviewLayoutChange,
  onNavigate,
}: EditorCanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const { commitElementLayout, commitImageFrame } = useElementLayout()
  const { commitTextElementContent } = useTextElementContent()
  const visible = resolveResponsiveValue(element.visibility, viewport)
  const isHeader = element.kind === 'header'
  const initialLayout: ElementLayout = resolveResponsiveElementLayout(
    element,
    viewport,
    canvasWidth,
  )
  const {
    layout,
    imageTransform,
    transformMode,
    handleMovePointerDown,
    handleResizePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,
  } = useElementPointerTransform({
    element,
    pageElements,
    viewport,
    initialLayout,
    canvasRef,
    scrollContainerRef,
    onSelect,
    onTransformStart: onCloseProperties,
    onClickWithoutTransform: onOpenProperties,
    onCommitLayout: (elementId, layout) =>
      commitElementLayout(elementId, viewport, layout),
    onCommitImageFrame: (elementId, layout, transform) =>
      commitImageFrame(elementId, viewport, layout, transform),
    onPreviewLayoutChange,
  })

  const { handleContextMenu, panel: aiPanel } = useElementAiContextMenu(
    element, layout, onSelect,
  )

  if (!visible) {
    return null
  }

  const isTextEditing = editing && element.kind === 'text'
  const contentElement =
    element.kind === 'image' && imageTransform
      ? { ...element, transform: imageTransform }
      : element
  const style: CSSProperties = {
    left: layout.position.x,
    top: layout.position.y,
    width: layout.size.width,
    height: layout.size.height,
    cursor: isHeader ? 'default' : undefined,
    ...getElementAppearanceCssStyle(element),
    ...(element.kind === 'text'
      ? getTextElementCssStyle(element.textStyle)
      : {}),
  }
  const transformClass = transformMode
    ? ` canvas-element--transforming canvas-element--${transformMode}`
    : ''
  const lockedClass = element.locked ? ' canvas-element--locked' : ''
  const editingClass = isTextEditing ? ' canvas-element--editing' : ''
  const accessibleLabel = getAccessibleElementLabel(element)

  const handleElementPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isHeader) {
      handleMovePointerDown(event)
      return
    }

    if (event.button !== 0) return
    event.stopPropagation()
    onSelect(element.id)
    onOpenProperties()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    handleCanvasElementKeyDown(event, {
      element,
      selected,
      initialLayout,
      canvasWidth,
      onSelect,
      onOpenProperties,
      onCloseProperties,
      onStartTextEditing,
      onCommitLayout: (elementId, layout) =>
        commitElementLayout(elementId, viewport, layout),
      onCommitImageFrame: (elementId, layout, transform) =>
        commitImageFrame(elementId, viewport, layout, transform),
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
        role={isTextEditing ? undefined : isHeader ? 'group' : 'button'}
        tabIndex={isTextEditing ? -1 : 0}
        aria-label={isTextEditing ? undefined : accessibleLabel}
        aria-keyshortcuts={
          isTextEditing
            ? undefined
            : getCanvasElementKeyboardShortcuts(element)
        }
        aria-pressed={isTextEditing || isHeader ? undefined : selected}
        data-element-id={element.id}
        onPointerDown={isTextEditing ? undefined : handleElementPointerDown}
        onPointerMove={isTextEditing ? undefined : handlePointerMove}
        onPointerUp={isTextEditing ? undefined : handlePointerUp}
        onPointerCancel={isTextEditing ? undefined : handlePointerCancel}
        onLostPointerCapture={
          isTextEditing ? undefined : handleLostPointerCapture
        }
        onDoubleClick={isTextEditing ? undefined : handleDoubleClick}
        onContextMenu={isTextEditing ? undefined : handleContextMenu}
        onKeyDown={isTextEditing ? undefined : handleKeyDown}
      >
        <EditorCanvasElementContent
          element={contentElement}
          editing={isTextEditing}
          selected={selected}
          frameSize={layout.size}
          onSelect={onSelect}
          onCommitText={(content) =>
            commitTextElementContent(element.id, content)
          }
          onFinishTextEditing={finishTextEditing}
          onNavigate={onNavigate}
        />
        {selected && !element.locked && !isTextEditing &&
          (element.kind === 'image' ? (
            <ImageResizeHandles onPointerDown={handleResizePointerDown} />
          ) : (
            <span
              className={`canvas-element__resize-handle${isHeader ? ' canvas-element__resize-handle--vertical' : ''}`}
              aria-hidden="true"
              onPointerDown={(event) =>
                handleResizePointerDown(
                  isHeader ? 'south' : 'south-east',
                  event,
                )
              }
            />
          ))}
      </div>
      {aiPanel}
      {selected && transformMode === null && !isTextEditing && (
        <ElementSelectionToolbar
          element={element}
          lockable={!isHeader}
          locked={element.locked}
          layout={layout}
          onOpenProperties={onOpenProperties}
        />
      )}
    </>
  )
}
