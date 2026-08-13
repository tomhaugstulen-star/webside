import type { ElementCreationRequest } from '../../model/elementCreation'
import type { EditorTool } from '../../types/editor'
import { ColorsPanel } from './ColorsPanel'
import { ElementsPanel } from './ElementsPanel'
import { HeaderCreationControl } from './HeaderCreationControl'
import { ProjectNavigatorPanel } from './ProjectNavigatorPanel'

type PanelProps = {
  onSelect: () => void
}

type ElementsPanelProps = {
  onCreateElement: (request: ElementCreationRequest) => boolean
}

type SidebarPanelProps = PanelProps & ElementsPanelProps & {
  activeTool: EditorTool
}

function LogoHeaderPanel({ onCreateElement }: ElementsPanelProps) {
  return (
    <>
      <h2>Logo og header</h2>
      <p className="panel-intro">
        Velg logo, skriv inn navn og opprett en samlet header på siden.
      </p>
      <HeaderCreationControl onCreateHeader={onCreateElement} />
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
      return <ColorsPanel />
    case 'media':
      return <LogoHeaderPanel onCreateElement={onCreateElement} />
    case 'elements':
      return <ElementsPanel onCreateElement={onCreateElement} />
    case 'files':
      return <ProjectNavigatorPanel />
    case 'settings':
      return <SettingsPanel onSelect={onSelect} />
  }

  const unhandledTool: never = activeTool
  return unhandledTool
}
