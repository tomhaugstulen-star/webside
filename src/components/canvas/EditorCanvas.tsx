import {
  useRef,
  useState,
  type CSSProperties,
} from 'react'
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

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  const { activePage } = useEditorProject()
  const { selectedElementId, selectElement, clearSelection } = useElementSelection()
  const [previewState, setPreviewState] = useState<CanvasPreviewState | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const layoutPreview =
    previewState?.pageId === activePage.id && previewState.viewport === viewport
      ? previewState.preview
      : null
  const contentHeight = getCanvasContentHeight(
    activePage.elements,
    viewport,
    layoutPreview,
  )
  const pageStyle: CSSProperties = contentHeight > 0 ? { height: contentHeight } : {}

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
            {activePage.elements.map((element) => (
              <EditorCanvasElement
                key={element.id}
                element={element}
                viewport={viewport}
                selected={element.id === selectedElementId}
                canvasRef={canvasRef}
                scrollContainerRef={scrollContainerRef}
                onSelect={selectElement}
                onPreviewLayoutChange={handlePreviewLayoutChange}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
