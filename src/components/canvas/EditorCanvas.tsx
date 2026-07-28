import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import type { ViewportMode } from '../../types/editor'
import { EditorCanvasElement } from './EditorCanvasElement'
import { getCanvasContentHeight } from './getCanvasContentHeight'
import type { ElementLayoutPreview } from './useElementPointerTransform'

type EditorCanvasProps = {
  viewport: ViewportMode
}

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  const { activePage } = useEditorProject()
  const { selectedElementId, selectElement, clearSelection } = useElementSelection()
  const [layoutPreview, setLayoutPreview] = useState<ElementLayoutPreview | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const contentHeight = getCanvasContentHeight(
    activePage.elements,
    viewport,
    layoutPreview,
  )
  const pageStyle: CSSProperties = contentHeight > 0 ? { height: contentHeight } : {}

  useEffect(() => {
    setLayoutPreview(null)
  }, [activePage.id, viewport])

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
                onPreviewLayoutChange={setLayoutPreview}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
