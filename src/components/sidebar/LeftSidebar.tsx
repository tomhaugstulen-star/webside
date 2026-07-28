import type { EditorTool } from '../../types/editor'
import { SidebarIcon, type SidebarIconName } from './SidebarIcon'
import { SidebarPanel } from './SidebarPanels'

type LeftSidebarProps = {
  activeTool: EditorTool | null
  onToolChange: (tool: EditorTool) => void
  onPanelAction: () => void
}

const tools: Array<{ id: EditorTool; label: string; icon: SidebarIconName }> = [
  { id: 'design', label: 'Design', icon: 'design' },
  { id: 'media', label: 'Bilder og logo', icon: 'media' },
  { id: 'elements', label: 'Elementer', icon: 'elements' },
  { id: 'files', label: 'Filer', icon: 'files' },
]

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
            <SidebarPanel activeTool={activeTool} onSelect={onPanelAction} />
          </div>
        )}
      </section>
    </aside>
  )
}
