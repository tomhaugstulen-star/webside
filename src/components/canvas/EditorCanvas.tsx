import type { ViewportMode } from '../../types/editor'

type EditorCanvasProps = {
  viewport: ViewportMode
}

type IconName = 'move' | 'fit' | 'duplicate' | 'delete' | 'lock'

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'move':
      return <svg {...common}><path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4" /></svg>
    case 'fit':
      return <svg {...common}><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" /></svg>
    case 'duplicate':
      return <svg {...common}><rect x="8" y="8" width="11" height="12" rx="1.5" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3" /></svg>
    case 'delete':
      return <svg {...common}><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></svg>
    case 'lock':
      return <svg {...common}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
  }
}

export function EditorCanvas({ viewport }: EditorCanvasProps) {
  return (
    <main className="editor-workspace">
      <div className="canvas-stage">
        <div className="canvas-wrap">
          <div className="canvas-floating-toolbar" aria-label="Sideverktøy">
            <button type="button" aria-label="Flytt"><Icon name="move" /></button>
            <button type="button" aria-label="Tilpass"><Icon name="fit" /></button>
            <button type="button" aria-label="Dupliser"><Icon name="duplicate" /></button>
            <span className="floating-divider" aria-hidden="true" />
            <button type="button" aria-label="Slett"><Icon name="delete" /></button>
          </div>

          <div className={`canvas-page canvas-page--${viewport}`} aria-label="Blank nettside">
            <button className="canvas-lock" type="button" aria-label="Lås siden"><Icon name="lock" /></button>
            <span className="canvas-handle canvas-handle--top-left" />
            <span className="canvas-handle canvas-handle--top-right" />
            <span className="canvas-handle canvas-handle--bottom-left" />
            <span className="canvas-handle canvas-handle--bottom-right" />
          </div>
        </div>
      </div>
    </main>
  )
}
