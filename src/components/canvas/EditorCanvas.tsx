import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import type { ViewportMode } from '../../types/editor'
import { EditorCanvasElement } from './EditorCanvasElement'

type EditorCanvasProps = {
  viewport: ViewportMode
}

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  const { activePage } = useEditorProject()
  const { selectedElementId, selectElement, clearSelection } = useElementSelection()

  return (
    <main className="editor-workspace" onPointerDown={clearSelection}>
      <div className="canvas-stage">
        <div className="canvas-wrap">
          <div
            className={`canvas-page canvas-page--${viewport}`}
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
