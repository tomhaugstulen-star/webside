import type { ElementCreationRequest } from '../../model/elementCreation'
import type { EditorTool } from '../../types/editor'
import { ElementsPanel } from './ElementsPanel'
import { SidebarIcon } from './SidebarIcon'

type PanelProps = {
  onSelect: () => void
}

type ElementsPanelProps = {
  onCreateElement: (request: ElementCreationRequest) => boolean
}

type SidebarPanelProps = PanelProps & ElementsPanelProps & {
  activeTool: EditorTool
}

function ColorsPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Farger</h2>
      <p className="panel-intro">
        Velg en del av siden for å endre utseende og oppsett.
      </p>
      <div className="setting-group">
        <h3>Sidestil</h3>
        <button className="setting-row" type="button" onClick={onSelect}>
          <span>Bakgrunn</span>
          <span>›</span>
        </button>
        <button className="setting-row" type="button" onClick={onSelect}>
          <span>Typografi</span>
          <span>›</span>
        </button>
        <button className="setting-row" type="button" onClick={onSelect}>
          <span>Avstander</span>
          <span>›</span>
        </button>
      </div>
      <div className="panel-tip">
        <span className="panel-tip__icon">✦</span>
        <p>
          Velg et element på den blanke siden for å åpne relevante
          innstillinger.
        </p>
      </div>
    </>
  )
}

function LogoHeaderPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Logo og header</h2>
      <button
        className="primary-panel-button"
        type="button"
        onClick={onSelect}
      >
        <SidebarIcon name="upload" />
        Last opp fil
      </button>
      <div className="empty-library">
        <SidebarIcon name="image" />
        <strong>Ingen bilder ennå</strong>
        <span>Last opp bilder eller logoer til prosjektet.</span>
      </div>
    </>
  )
}

function ProjectPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Prosjekt</h2>
      <button
        className="primary-panel-button"
        type="button"
        onClick={onSelect}
      >
        <SidebarIcon name="upload" />
        Last opp fil
      </button>
      <div className="empty-library">
        <SidebarIcon name="files" />
        <strong>Ingen filer</strong>
        <span>Dokumenter og vedlegg vises her.</span>
      </div>
    </>
  )
}

function SettingsPanel({ onSelect }: PanelProps) {
  return (
    <>
      <h2>Innstillinger</h2>
      <div className="setting-group">
        <button className="setting-row" type="button" onClick={onSelect}>
          <span>Prosjektnavn</span>
          <span>›</span>
        </button>
        <button className="setting-row" type="button" onClick={onSelect}>
          <span>Domene</span>
          <span>›</span>
        </button>
        <button className="setting-row" type="button" onClick={onSelect}>
          <span>SEO</span>
          <span>›</span>
        </button>
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
      return <ColorsPanel onSelect={onSelect} />
    case 'media':
      return <LogoHeaderPanel onSelect={onSelect} />
    case 'elements':
      return <ElementsPanel onCreateElement={onCreateElement} />
    case 'files':
      return <ProjectPanel onSelect={onSelect} />
    case 'settings':
      return <SettingsPanel onSelect={onSelect} />
  }

  const unhandledTool: never = activeTool
  return unhandledTool
}
