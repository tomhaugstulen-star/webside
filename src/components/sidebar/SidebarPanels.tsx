import type { ElementKind } from '../../model/editorProject'
import type { EditorTool } from '../../types/editor'
import { SidebarIcon, type SidebarIconName } from './SidebarIcon'

type PanelProps = {
  onSelect: () => void
}

type ElementsPanelProps = {
  onCreateElement: (kind: ElementKind) => void
}

type SidebarPanelProps = PanelProps & ElementsPanelProps & {
  activeTool: EditorTool
}

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
      <button className="primary-panel-button" type="button" onClick={onSelect}><SidebarIcon name="upload" />Last opp fil</button>
      <div className="empty-library"><SidebarIcon name="image" /><strong>Ingen bilder ennå</strong><span>Last opp bilder eller logoer til prosjektet.</span></div>
    </>
  )
}

function ElementsPanel({ onCreateElement }: ElementsPanelProps) {
  const items: Array<{
    kind: ElementKind
    label: string
    icon: SidebarIconName
  }> = [
    { kind: 'section', label: 'Seksjon', icon: 'section' },
    { kind: 'image', label: 'Bilde', icon: 'image' },
    { kind: 'text', label: 'Tekst', icon: 'text' },
    { kind: 'button', label: 'Knapp', icon: 'button' },
  ]

  return (
    <>
      <h2>Elementer</h2>
      <p className="panel-intro">Velg et element for å legge det til på siden.</p>
      <div className="element-grid">
        {items.map((item) => (
          <button
            key={item.kind}
            className="element-card"
            type="button"
            onClick={() => onCreateElement(item.kind)}
          >
            <SidebarIcon name={item.icon} />
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
      <button className="primary-panel-button" type="button" onClick={onSelect}><SidebarIcon name="upload" />Last opp fil</button>
      <div className="empty-library"><SidebarIcon name="files" /><strong>Ingen filer</strong><span>Dokumenter og vedlegg vises her.</span></div>
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

export function SidebarPanel({
  activeTool,
  onSelect,
  onCreateElement,
}: SidebarPanelProps) {
  switch (activeTool) {
    case 'design':
      return <DesignPanel onSelect={onSelect} />
    case 'media':
      return <MediaPanel onSelect={onSelect} />
    case 'elements':
      return <ElementsPanel onCreateElement={onCreateElement} />
    case 'files':
      return <FilesPanel onSelect={onSelect} />
    case 'settings':
      return <SettingsPanel onSelect={onSelect} />
  }
}
