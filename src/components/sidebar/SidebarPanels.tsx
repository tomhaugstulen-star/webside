import type { ElementCreationRequest } from '../../model/elementCreation'
import type { EditorTool } from '../../types/editor'
import { ColorsPanel } from './ColorsPanel'
import { ElementsPanel } from './ElementsPanel'
import { HeaderCreationControl } from './HeaderCreationControl'
import { ProjectNavigatorPanel } from './ProjectNavigatorPanel'
import { SiteSettingsPanel } from './SiteSettingsPanel'

type ElementsPanelProps = {
  onCreateElement: (request: ElementCreationRequest) => boolean
}

type SidebarPanelProps = ElementsPanelProps & {
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

function SettingsPanel() {
  return <SiteSettingsPanel />
}

export function SidebarPanel({
  activeTool,
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
      return <SettingsPanel />
  }

  const unhandledTool: never = activeTool
  return unhandledTool
}
