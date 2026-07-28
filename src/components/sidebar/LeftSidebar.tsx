import type { EditorTool } from '../../types/editor'

type LeftSidebarProps = {
  activeTool: EditorTool
  onToolChange: (tool: EditorTool) => void
}

const tools: Array<{ id: EditorTool; label: string; icon: string }> = [
  { id: 'add', label: 'Legg til', icon: '+' },
  { id: 'pages', label: 'Sider', icon: '▤' },
  { id: 'layers', label: 'Lag', icon: '≡' },
  { id: 'assets', label: 'Filer', icon: '◇' },
]

const elementItems = ['Seksjon', 'Beholder', 'Tekst', 'Bilde', 'Knapp', 'Skjema']

export function LeftSidebar({ activeTool, onToolChange }: LeftSidebarProps) {
  return (
    <aside className="left-sidebar">
      <nav className="left-rail" aria-label="Editorverktøy">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="rail-button"
            type="button"
            aria-label={tool.label}
            aria-pressed={activeTool === tool.id}
            onClick={() => onToolChange(tool.id)}
          >
            <span className="rail-button__icon" aria-hidden="true">{tool.icon}</span>
            <span className="rail-button__label">{tool.label}</span>
          </button>
        ))}
      </nav>

      <section className="left-panel">
        {activeTool === 'add' && (
          <>
            <div className="panel-heading">
              <h2>Elementer</h2>
              <button type="button" aria-label="Lukk panel">×</button>
            </div>
            <input className="panel-search" type="search" placeholder="Søk etter elementer" aria-label="Søk etter elementer" />
            <div className="element-grid">
              {elementItems.map((item) => (
                <button key={item} type="button" className="element-card">
                  <span aria-hidden="true">□</span>
                  {item}
                </button>
              ))}
            </div>
          </>
        )}

        {activeTool === 'pages' && (
          <>
            <div className="panel-heading"><h2>Sider</h2><button type="button">+</button></div>
            <button className="page-row page-row--active" type="button">Forside</button>
          </>
        )}

        {activeTool === 'layers' && (
          <>
            <div className="panel-heading"><h2>Lag</h2></div>
            <div className="empty-panel-state">Den blanke siden har ingen elementer.</div>
          </>
        )}

        {activeTool === 'assets' && (
          <>
            <div className="panel-heading"><h2>Filer</h2><button type="button">+</button></div>
            <div className="empty-panel-state">Ingen filer er lastet opp.</div>
          </>
        )}
      </section>
    </aside>
  )
}
