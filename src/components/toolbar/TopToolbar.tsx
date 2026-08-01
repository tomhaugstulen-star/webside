import { useEffect, useRef, useState } from 'react'
import type { PersistenceStatus } from '../../persistence/persistenceContext'
import type { ViewportMode } from '../../types/editor'
import { ToolbarIcon } from './ToolbarIcon'

type TopToolbarProps = {
  pageName: string
  viewport: ViewportMode
  persistenceStatus: PersistenceStatus
  onViewportChange: (viewport: ViewportMode) => void
  onSave: () => Promise<boolean>
  onResetProject: () => void
}

const persistenceLabels: Record<PersistenceStatus, string> = {
  idle: 'Ikke lagret',
  saving: 'Lagrer…',
  saved: 'Lagret',
  error: 'Lagringsfeil',
}

export function TopToolbar({
  pageName,
  viewport,
  persistenceStatus,
  onViewportChange,
  onSave,
  onResetProject,
}: TopToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const persistenceLabel = persistenceLabels[persistenceStatus]

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const closeOnPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnPointerDown)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  return (
    <header className="top-toolbar">
      <div className="top-toolbar__brand">
        <div className="brand-mark"><ToolbarIcon name="sun" /></div>
        <span className="brand-name">Website</span>
      </div>

      <button className="page-selector" type="button">
        <span>{pageName}</span>
        <ToolbarIcon name="chevron" />
      </button>

      <div className="top-toolbar__viewport" aria-label="Velg visning">
        <button
          className="viewport-button"
          type="button"
          aria-label="Skrivebord"
          aria-pressed={viewport === 'desktop'}
          onClick={() => onViewportChange('desktop')}
        >
          <ToolbarIcon name="desktop" />
        </button>
        <button
          className="viewport-button"
          type="button"
          aria-label="Mobil"
          aria-pressed={viewport === 'mobile'}
          onClick={() => onViewportChange('mobile')}
        >
          <ToolbarIcon name="mobile" />
        </button>
      </div>

      <div className="top-toolbar__history" aria-label="Historikk">
        <button
          className="toolbar-icon-button"
          type="button"
          aria-label="Angre"
        >
          <ToolbarIcon name="undo" />
        </button>
        <button
          className="toolbar-icon-button"
          type="button"
          aria-label="Gjør om"
          disabled
        >
          <ToolbarIcon name="redo" />
        </button>
      </div>

      <div className="top-toolbar__actions">
        <button className="toolbar-action" type="button">
          <ToolbarIcon name="eye" />
          <span>Forhåndsvisning</span>
        </button>
        <button
          className={`toolbar-action toolbar-action--persistence toolbar-action--${persistenceStatus}`}
          type="button"
          disabled={persistenceStatus === 'saving'}
          aria-label={`Lokal lagring: ${persistenceLabel}`}
          onClick={() => void onSave()}
        >
          <ToolbarIcon name="save" />
          <span aria-live="polite">{persistenceLabel}</span>
        </button>
        <button className="publish-button" type="button">
          <ToolbarIcon name="publish" />
          <span>Publiser</span>
        </button>
        <div className="main-menu-wrap" ref={menuRef}>
          <button
            className="main-menu-button"
            type="button"
            aria-label="Åpne hovedmeny"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <ToolbarIcon name="menu" />
          </button>
          {menuOpen && (
            <div className="main-menu-popover">
              <button type="button">Prosjektinnstillinger</button>
              <button type="button">Dupliser prosjekt</button>
              <button
                className="main-menu-popover__danger"
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onResetProject()
                }}
              >
                Nullstill lokalt prosjekt
              </button>
              <button type="button">Hjelp</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
