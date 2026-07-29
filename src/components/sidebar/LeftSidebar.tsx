import type { ElementCreationRequest } from '../../model/elementCreation'
import type { EditorTool } from '../../types/editor'
import { SidebarIcon, type SidebarIconName } from './SidebarIcon'
import { SidebarPanel } from './SidebarPanels'

type LeftSidebarProps = {
  activeTool: EditorTool | null
  onToolChange: (tool: EditorTool) => void
  onPanelAction: () => void
  onCreateElement: (request: ElementCreationRequest) => void
}

const tools: Array<{ id: EditorTool; label: string; icon: SidebarIconName }> = [
  { id: 'files', label: 'Prosjekt', icon: 'files' },
  { id: 'design', label: 'Farger', icon: 'design' },
  { id: 'media', label: 'Logo og header', icon: 'media' },
  { id: 'elements', label: 'Elementer', icon: 'elements' },
]

export function LeftSidebar({
  activeTool,
  onToolChange,
  onPanelAction,
  onCreateElement,
}: LeftSidebarProps) {
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
              <SidebarIcon name={tool.icon} />
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
          <SidebarIcon name="settings" />
          <span>Innstillinger</span>
        </button>
      </nav>

      <section className={`left-panel ${activeTool ? 'left-panel--open' : ''}`} aria-hidden={!activeTool}>
        {activeTool && (
          <div className="left-panel__content">
            <SidebarPanel
              activeTool={activeTool}
              onSelect={onPanelAction}
              onCreateElement={onCreateElement}
            />
          </div>
        )}
      </section>
    </aside>
  )
}
