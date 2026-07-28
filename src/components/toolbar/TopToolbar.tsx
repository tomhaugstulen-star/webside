import type { ViewportMode } from '../../types/editor'

type TopToolbarProps = {
  viewport: ViewportMode
  onViewportChange: (viewport: ViewportMode) => void
}

const viewportButtons: Array<{
  id: ViewportMode
  label: string
  icon: string
}> = [
  { id: 'desktop', label: 'Skrivebord', icon: '▭' },
  { id: 'tablet', label: 'Nettbrett', icon: '▯' },
  { id: 'mobile', label: 'Mobil', icon: '▯' },
]

export function TopToolbar({ viewport, onViewportChange }: TopToolbarProps) {
  return (
    <header className="top-toolbar">
      <div className="top-toolbar__project">
        <button className="icon-button icon-button--dark" type="button" aria-label="Åpne hovedmeny">
          <span aria-hidden="true">☰</span>
        </button>
        <div className="project-name">
          <span className="project-name__title">webside</span>
          <span className="project-name__page">Forside</span>
        </div>
      </div>

      <div className="top-toolbar__history" aria-label="Historikk">
        <button className="icon-button icon-button--dark" type="button" aria-label="Angre" disabled>
          ↶
        </button>
        <button className="icon-button icon-button--dark" type="button" aria-label="Gjør om" disabled>
          ↷
        </button>
      </div>

      <div className="viewport-switcher" aria-label="Velg visningsbredde">
        {viewportButtons.map((button) => (
          <button
            className="viewport-button"
            type="button"
            key={button.id}
            aria-label={button.label}
            aria-pressed={viewport === button.id}
            onClick={() => onViewportChange(button.id)}
          >
            <span aria-hidden="true">{button.icon}</span>
          </button>
        ))}
      </div>

      <div className="top-toolbar__actions">
        <button className="toolbar-action" type="button">Forhåndsvis</button>
        <button className="toolbar-action" type="button">Del</button>
        <button className="publish-button" type="button">Publiser</button>
      </div>
    </header>
  )
}
