import type { InspectorTool } from '../../types/editor'

type InspectorRailProps = {
  activeTool: InspectorTool
  isOpen: boolean
  onToolChange: (tool: InspectorTool) => void
  onToggle: () => void
}

const inspectorTools: Array<{ id: InspectorTool; label: string; icon: string }> = [
  { id: 'design', label: 'Design', icon: '✦' },
  { id: 'layout', label: 'Oppsett', icon: '⌗' },
  { id: 'settings', label: 'Innstillinger', icon: '⚙' },
]

export function InspectorRail({ activeTool, isOpen, onToolChange, onToggle }: InspectorRailProps) {
  const selectTool = (tool: InspectorTool) => {
    if (activeTool === tool) {
      onToggle()
      return
    }

    onToolChange(tool)
  }

  return (
    <aside className={`inspector ${isOpen ? 'inspector--open' : ''}`}>
      {isOpen && (
        <section className="inspector-panel">
          <div className="panel-heading">
            <h2>{activeTool === 'design' ? 'Design' : activeTool === 'layout' ? 'Oppsett' : 'Innstillinger'}</h2>
            <button type="button" aria-label="Lukk egenskapspanel" onClick={onToggle}>×</button>
          </div>
          <div className="inspector-empty">
            <strong>Ingen elementer valgt</strong>
            <span>Velg et element på siden for å redigere egenskapene.</span>
          </div>
        </section>
      )}

      <nav className="inspector-rail" aria-label="Egenskaper">
        {inspectorTools.map((tool) => (
          <button
            key={tool.id}
            className="inspector-button"
            type="button"
            aria-label={tool.label}
            aria-pressed={isOpen && activeTool === tool.id}
            onClick={() => selectTool(tool.id)}
          >
            <span aria-hidden="true">{tool.icon}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
