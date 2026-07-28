import type { ViewportMode } from '../../types/editor'

type EditorCanvasProps = {
  viewport: ViewportMode
}

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  return (
    <main className="editor-workspace">
      <div className="canvas-stage">
        <div className="canvas-wrap">
          <div className={`canvas-page canvas-page--${viewport}`} aria-label="Blank nettside" />
        </div>
      </div>
    </main>
  )
}
