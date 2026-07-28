import { useEffect, useRef, useState } from 'react'
import type { ViewportMode } from '../../types/editor'

type TopToolbarProps = {
  pageName: string
  viewport: ViewportMode
  onViewportChange: (viewport: ViewportMode) => void
}

type IconName =
  | 'sun'
  | 'chevron'
  | 'desktop'
  | 'mobile'
  | 'undo'
  | 'redo'
  | 'eye'
  | 'save'
  | 'publish'
  | 'menu'

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
        </svg>
      )
    case 'chevron':
      return <svg {...common}><path d="m8 10 4 4 4-4" /></svg>
    case 'desktop':
      return <svg {...common}><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M8 21h8M12 17v4" /></svg>
    case 'mobile':
      return <svg {...common}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>
    case 'undo':
      return <svg {...common}><path d="M9 7 4 12l5 5" /><path d="M5 12h8a6 6 0 0 1 6 6" /></svg>
    case 'redo':
      return <svg {...common}><path d="m15 7 5 5-5 5" /><path d="M19 12h-8a6 6 0 0 0-6 6" /></svg>
    case 'eye':
      return <svg {...common}><path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>
    case 'save':
      return <svg {...common}><path d="M4 3h13l3 3v15H4Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></svg>
    case 'publish':
      return <svg {...common}><path d="M12 16V3M7 8l5-5 5 5" /><path d="M5 14v6h14v-6" /></svg>
    case 'menu':
      return <svg {...common}><path d="M5 7h14M5 12h14M5 17h14" /></svg>
  }
}

export function TopToolbar({ pageName, viewport, onViewportChange }: TopToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
        <div className="brand-mark"><Icon name="sun" /></div>
        <span className="brand-name">Website</span>
      </div>

      <button className="page-selector" type="button">
        <span>{pageName}</span>
        <Icon name="chevron" />
      </button>

      <div className="top-toolbar__viewport" aria-label="Velg visning">
        <button
          className="viewport-button"
          type="button"
          aria-label="Skrivebord"
          aria-pressed={viewport === 'desktop'}
          onClick={() => onViewportChange('desktop')}
        >
          <Icon name="desktop" />
        </button>
        <button
          className="viewport-button"
          type="button"
          aria-label="Mobil"
          aria-pressed={viewport === 'mobile'}
          onClick={() => onViewportChange('mobile')}
        >
          <Icon name="mobile" />
        </button>
      </div>

      <div className="top-toolbar__history" aria-label="Historikk">
        <button className="toolbar-icon-button" type="button" aria-label="Angre"><Icon name="undo" /></button>
        <button className="toolbar-icon-button" type="button" aria-label="Gjør om" disabled><Icon name="redo" /></button>
      </div>

      <div className="top-toolbar__actions">
        <button className="toolbar-action" type="button"><Icon name="eye" /><span>Forhåndsvisning</span></button>
        <button className="toolbar-action" type="button"><Icon name="save" /><span>Lagre</span></button>
        <button className="publish-button" type="button"><Icon name="publish" /><span>Publiser</span></button>
        <div className="main-menu-wrap" ref={menuRef}>
          <button
            className="main-menu-button"
            type="button"
            aria-label="Åpne hovedmeny"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <Icon name="menu" />
          </button>
          {menuOpen && (
            <div className="main-menu-popover">
              <button type="button">Prosjektinnstillinger</button>
              <button type="button">Dupliser prosjekt</button>
              <button type="button">Hjelp</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
