import type { ViewportMode } from '../../types/editor'
import { PreviewCanvas } from './PreviewCanvas'

type PreviewShellProps = {
  viewport: ViewportMode
  desktopCanvasWidth: number
  onViewportChange: (viewport: ViewportMode) => void
  onClose: () => void
}

export function PreviewShell({
  viewport,
  desktopCanvasWidth,
  onViewportChange,
  onClose,
}: PreviewShellProps) {
  return (
    <div className="preview-shell">
      <header className="preview-toolbar">
        <strong>Forhåndsvisning</strong>
        <div className="preview-toolbar__actions">
          <div className="preview-toolbar__viewport" aria-label="Velg visning">
            <button
              type="button"
              aria-pressed={viewport === 'desktop'}
              onClick={() => onViewportChange('desktop')}
            >
              PC
            </button>
            <button
              type="button"
              aria-pressed={viewport === 'mobile'}
              onClick={() => onViewportChange('mobile')}
            >
              Telefon
            </button>
          </div>
          <button
            className="preview-toolbar__close"
            type="button"
            onClick={onClose}
          >
            Lukk forhåndsvisning
          </button>
        </div>
      </header>
      <PreviewCanvas viewport={viewport} desktopCanvasWidth={desktopCanvasWidth} />
    </div>
  )
}
