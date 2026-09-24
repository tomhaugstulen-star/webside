import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { EditorElement } from '../../model/editorProject'
import type { NavigationTarget } from '../../model/navigation'
import { editorFillToCssBackground } from '../../model/editorFill'
import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import type { ViewportMode } from '../../types/editor'
import { AlignmentGuideOverlay } from './AlignmentGuideOverlay'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import { EditorCanvasElement } from './EditorCanvasElement'
import { getCanvasContentHeight } from './getCanvasContentHeight'

type EditorCanvasProps = {
  viewport: ViewportMode
  onWorkspacePointerDown: () => void
  onOpenProperties: () => void
  onCloseProperties: () => void
  onCanvasWidthChange: (width: number) => void
}

type CanvasPreviewState = {
  pageId: string
  viewport: ViewportMode
  preview: ElementLayoutPreview
}

type TextEditingState = {
  pageId: string
  elementId: string
}

function orderElementsForRendering(elements: EditorElement[]) {
  const sections: EditorElement[] = []
  const foregroundElements: EditorElement[] = []

  elements.forEach((element) => {
    if (element.kind === 'section') {
      sections.push(element)
    } else {
      foregroundElements.push(element)
    }
  })

  return [...sections, ...foregroundElements]
}

export function EditorCanvas({
  viewport,
  onWorkspacePointerDown,
  onOpenProperties,
  onCloseProperties,
  onCanvasWidthChange,
}: EditorCanvasProps) {
  const { activePage, dispatch } = useEditorProject()
  const { selectedElementId, selectElement, clearSelection } =
    useElementSelection()
  const [previewState, setPreviewState] =
    useState<CanvasPreviewState | null>(null)
  const [textEditingState, setTextEditingState] =
    useState<TextEditingState | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const pendingNavigationRef = useRef<NavigationTarget | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const layoutPreview =
    previewState?.pageId === activePage.id &&
    previewState.viewport === viewport
      ? previewState.preview
      : null
  const editingElementId =
    textEditingState?.pageId === activePage.id
      ? textEditingState.elementId
      : null
  const contentHeight = getCanvasContentHeight(
    activePage.elements,
    viewport,
    canvasWidth,
    layoutPreview,
  )
  const pageStyle: CSSProperties = {
    background: editorFillToCssBackground(activePage.appearance.backgroundFill),
    ...(contentHeight > 0 ? { height: contentHeight } : {}),
  }
  const renderElements = orderElementsForRendering(activePage.elements)
  const alignmentGuides = layoutPreview?.guides ?? []

  useLayoutEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const updateCanvasWidth = () => {
      const width = canvas.clientWidth
      setCanvasWidth(width)
      if (viewport === 'desktop') onCanvasWidthChange(width)
    }
    const observer = new ResizeObserver(updateCanvasWidth)
    updateCanvasWidth()
    observer.observe(canvas)

    return () => observer.disconnect()
  }, [onCanvasWidthChange, viewport])

  const handlePreviewLayoutChange = (
    preview: ElementLayoutPreview | null,
  ) => {
    setPreviewState(
      preview
        ? {
            pageId: activePage.id,
            viewport,
            preview,
          }
        : null,
    )
  }

  const startTextEditing = (elementId: string) => {
    selectElement(elementId)
    setTextEditingState({ pageId: activePage.id, elementId })
  }

  const finishTextEditing = (elementId: string) => {
    setTextEditingState((current) =>
      current?.pageId === activePage.id && current.elementId === elementId
        ? null
        : current,
    )
  }

  const clearSelectionAndProperties = () => {
    clearSelection()
    onCloseProperties()
  }

  const scrollToNavigationTarget = useCallback(
    (target: NavigationTarget) => {
      const scrollContainer = scrollContainerRef.current

      if (!scrollContainer) {
        return
      }

      if (target.type === 'page') {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      requestAnimationFrame(() => {
        const section = Array.from(
          canvasRef.current?.querySelectorAll<HTMLElement>(
            '[data-element-id]',
          ) ?? [],
        ).find(
          (candidate) => candidate.dataset.elementId === target.elementId,
        )

        section?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    },
    [],
  )

  const navigateFromHeader = (target: NavigationTarget) => {
    clearSelectionAndProperties()
    setTextEditingState(null)

    if (target.pageId === activePage.id) {
      scrollToNavigationTarget(target)
      return
    }

    pendingNavigationRef.current = target
    dispatch({ type: 'set-active-page', pageId: target.pageId })
  }

  useLayoutEffect(() => {
    const pendingNavigation = pendingNavigationRef.current

    if (!pendingNavigation || pendingNavigation.pageId !== activePage.id) {
      return
    }

    pendingNavigationRef.current = null
    scrollToNavigationTarget(pendingNavigation)
  }, [activePage.id, scrollToNavigationTarget])

  return (
    <main
      className="editor-workspace"
      onPointerDownCapture={onWorkspacePointerDown}
      onPointerDown={clearSelectionAndProperties}
    >
      <div className="canvas-stage" ref={scrollContainerRef}>
        <div className="canvas-wrap">
          <div
            ref={canvasRef}
            className={`canvas-page canvas-page--${viewport}`}
            style={pageStyle}
            aria-label={`Nettside: ${activePage.name}`}
          >
            {renderElements.map((element) => (
              <EditorCanvasElement
                key={element.id}
                element={element}
                pageElements={activePage.elements}
                viewport={viewport}
                canvasWidth={canvasWidth}
                selected={element.id === selectedElementId}
                editing={element.id === editingElementId}
                canvasRef={canvasRef}
                scrollContainerRef={scrollContainerRef}
                onSelect={selectElement}
                onOpenProperties={onOpenProperties}
                onCloseProperties={onCloseProperties}
                onStartTextEditing={startTextEditing}
                onFinishTextEditing={finishTextEditing}
                onPreviewLayoutChange={handlePreviewLayoutChange}
                onNavigate={navigateFromHeader}
              />
            ))}
            <AlignmentGuideOverlay guides={alignmentGuides} />
          </div>
        </div>
      </div>
    </main>
  )
}
