import type { CSSProperties } from 'react'
import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import type { ViewportMode } from '../../types/editor'
import { EditorCanvasElement } from './EditorCanvasElement'
import { getCanvasContentHeight } from './getCanvasContentHeight'

type EditorCanvasProps = {
  viewport: ViewportMode
}

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  const { activePage } = useEditorProject()
  const { selectedElementId, selectElement, clearSelection } = useElementSelection()
  const contentHeight = getCanvasContentHeight(activePage.elements, viewport)
  const pageStyle: CSSProperties = contentHeight > 0 ? { height: contentHeight } : {}

  return (
    <main className="editor-workspace" onPointerDown={clearSelection}>
      <div className="canvas-stage">
        <div className="canvas-wrap">
          <div
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
                onSelect={selectElement}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
