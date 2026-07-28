import type { ViewportMode } from '../../types/editor'

type EditorCanvasProps = {
  viewport: ViewportMode
}

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  return (
    <main className="editor-workspace">
      <div className="canvas-toolbar">
        <span>100%</span>
        <span className="canvas-toolbar__divider" aria-hidden="true" />
        <span>{viewport === 'desktop' ? '1440 px' : viewport === 'tablet' ? '768 px' : '390 px'}</span>
      </div>

      <div className="canvas-stage">
        <div className={`canvas-page canvas-page--${viewport}`} aria-label="Blank nettside" />
      </div>
    </main>
  )
}
