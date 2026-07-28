import type { EditorTool } from '../../types/editor'

type LeftSidebarProps = {
  activeTool: EditorTool | null
  onToolChange: (tool: EditorTool) => void
  onPanelAction: () => void
}

type PanelProps = {
  onSelect: () => void
}

type IconName = 'design' | 'media' | 'boxes' | 'files' | 'settings' | 'upload' | 'image' | 'section' | 'text' | 'button'

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.65,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'design':
      return <svg {...common}><path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 0-4H12a1.6 1.6 0 0 1 0-3.2h2.3A6.7 6.7 0 0 0 21 7.1 4.1 4.1 0 0 0 16.9 3Z" /><circle cx="7.5" cy="10" r=".7" fill="currentColor" stroke="none" /><circle cx="9" cy="6.8" r=".7" fill="currentColor" stroke="none" /><circle cx="13" cy="5.8" r=".7" fill="currentColor" stroke="none" /><circle cx="16.3" cy="7.6" r=".7" fill="currentColor" stroke="none" /></svg>
    case 'media':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4.5 17 4.8-4.8 3.2 3.2 2.4-2.4 4.6 4.6" /></svg>
    case 'boxes':
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="1.5" /></svg>
    case 'files':
      return <svg {...common}><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v5h5" /></svg>
    case 'settings':
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></svg>
    case 'upload':
      return <svg {...common}><path d="M12 16V4M8 8l4-4 4 4" /><path d="M5 14v6h14v-6" /></svg>
    case 'image':
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m4.5 17 4.5-4.5 3 3 2.5-2.5 5 5" /></svg>
    case 'section':
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 10h18" /></svg>
    case 'text':
      return <svg {...common}><path d="M5 6h14M12 6v12M8.5 18h7" /></svg>
    case 'button':
      return <svg {...common}><rect x="4" y="7" width="16" height="10" rx="5" /><path d="M9 12h6" /></svg>
  }
}

const tools: Array<{ id: EditorTool; label: string; icon: IconName }> = [
  { id: 'design', label: 'Design', icon: 'design' },
  { id: 'media', label: 'Bilder og logo', icon: 'media' },
  { id: 'boxes', label: 'Elementer', icon: 'boxes' },
  { id: 'files', label: 'Filer', icon: 'files' },
]

function DesignPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Design</h2>
      <p className="panel-intro">Velg en del av siden for å endre utseende og oppsett.</p>
      <div className="setting-group">
        <h3>Sidestil</h3>
        <button className="setting-row" type="button" onClick={onSelect}><span>Bakgrunn</span><span>›</span></button>
        <button className="setting-row" type="button" onClick={onSelect}><span>Typografi</span><span>›</span></button>
        <button className="setting-row" type="button" onClick={onSelect}><span>Avstander</span><span>›</span></button>
      </div>
      <div className="panel-tip">
        <span className="panel-tip__icon">✦</span>
        <p>Velg et element på den blanke siden for å åpne relevante innstillinger.</p>
      </div>
    </>
  )
}

function MediaPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Bilder og logo</h2>
      <button className="primary-panel-button" type="button" onClick={onSelect}><Icon name="upload" />Last opp fil</button>
      <div className="empty-library"><Icon name="image" /><strong>Ingen bilder ennå</strong><span>Last opp bilder eller logoer til prosjektet.</span></div>
    </>
  )
}

function ElementsPanel({ onSelect }: PanelProps) {
  const items: Array<{ label: string; icon: IconName }> = [
    { label: 'Seksjon', icon: 'section' },
    { label: 'Bilde', icon: 'image' },
    { label: 'Tekst', icon: 'text' },
    { label: 'Knapp', icon: 'button' },
  ]

  return (
    <>
      <h2>Elementer</h2>
      <p className="panel-intro">Velg et element for å legge det til på siden.</p>
      <div className="box-grid">
        {items.map((item) => (
          <button key={item.label} className="box-card" type="button" onClick={onSelect}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}

function FilesPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Filer</h2>
      <button className="primary-panel-button" type="button" onClick={onSelect}><Icon name="upload" />Last opp fil</button>
      <div className="empty-library"><Icon name="files" /><strong>Ingen filer</strong><span>Dokumenter og vedlegg vises her.</span></div>
    </>
  )
}

function SettingsPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Innstillinger</h2>
      <div className="setting-group">
        <button className="setting-row" type="button" onClick={onSelect}><span>Prosjektnavn</span><span>›</span></button>
        <button className="setting-row" type="button" onClick={onSelect}><span>Domene</span><span>›</span></button>
        <button className="setting-row" type="button" onClick={onSelect}><span>SEO</span><span>›</span></button>
      </div>
    </>
  )
}

export function LeftSidebar({ activeTool, onToolChange, onPanelAction }: LeftSidebarProps) {
  return (
    <aside className="left-sidebar">
      <nav className="left-rail" aria-label="Editorverktøy">
        <div className="left-rail__main">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className="rail-button"
              type="button"
              aria-expanded={activeTool === tool.id}
              aria-pressed={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
            >
              <Icon name={tool.icon} />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
        <button
          className="rail-button rail-button--settings"
          type="button"
          aria-expanded={activeTool === 'settings'}
          aria-pressed={activeTool === 'settings'}
          onClick={() => onToolChange('settings')}
        >
          <Icon name="settings" />
          <span>Innstillinger</span>
        </button>
      </nav>

      <section className={`left-panel ${activeTool ? 'left-panel--open' : ''}`} aria-hidden={!activeTool}>
        {activeTool && (
          <div className="left-panel__content">
            {activeTool === 'design' && <DesignPanel onSelect={onPanelAction} />}
            {activeTool === 'media' && <MediaPanel onSelect={onPanelAction} />}
            {activeTool === 'boxes' && <ElementsPanel onSelect={onPanelAction} />}
            {activeTool === 'files' && <FilesPanel onSelect={onPanelAction} />}
            {activeTool === 'settings' && <SettingsPanel onSelect={onPanelAction} />}
          </div>
        )}
      </section>
    </aside>
  )
}
