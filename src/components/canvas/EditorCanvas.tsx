import {
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { EditorElement } from '../../model/editorProject'
import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import type { ViewportMode } from '../../types/editor'
import type { ElementLayoutPreview } from './canvasLayoutPreview'
import { EditorCanvasElement } from './EditorCanvasElement'
import { getCanvasContentHeight } from './getCanvasContentHeight'

type EditorCanvasProps = {
  viewport: ViewportMode
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

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  const { activePage } = useEditorProject()
  const { selectedElementId, selectElement, clearSelection } = useElementSelection()
  const [previewState, setPreviewState] = useState<CanvasPreviewState | null>(null)
  const [textEditingState, setTextEditingState] = useState<TextEditingState | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const layoutPreview =
    previewState?.pageId === activePage.id && previewState.viewport === viewport
      ? previewState.preview
      : null
  const editingElementId =
    textEditingState?.pageId === activePage.id ? textEditingState.elementId : null
  const contentHeight = getCanvasContentHeight(
    activePage.elements,
    viewport,
    layoutPreview,
  )
  const pageStyle: CSSProperties = contentHeight > 0 ? { height: contentHeight } : {}
  const renderElements = orderElementsForRendering(activePage.elements)

  const handlePreviewLayoutChange = (preview: ElementLayoutPreview | null) => {
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

  return (
    <main className="editor-workspace" onPointerDown={clearSelection}>
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
                viewport={viewport}
                selected={element.id === selectedElementId}
                editing={element.id === editingElementId}
                canvasRef={canvasRef}
                scrollContainerRef={scrollContainerRef}
                onSelect={selectElement}
                onStartTextEditing={startTextEditing}
                onFinishTextEditing={finishTextEditing}
                onPreviewLayoutChange={handlePreviewLayoutChange}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
