import { useEffect, useState } from 'react'
import { EditorCanvas } from '../canvas/EditorCanvas'
import { LeftSidebar } from '../sidebar/LeftSidebar'
import { TopToolbar } from '../toolbar/TopToolbar'
import { useEditorProject } from '../../state/useEditorProject'
import type { EditorTool, ViewportMode } from '../../types/editor'

export function EditorShell() {
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null)
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const { activePage } = useEditorProject()

  const toggleToolPanel = (tool: EditorTool) => {
    setActiveTool((currentTool) => (currentTool === tool ? null : tool))
  }

  const closeToolPanel = () => {
    setActiveTool(null)
  }

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveTool(null)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <div className={`editor-shell ${activeTool ? 'editor-shell--panel-open' : ''}`}>
      <TopToolbar
        pageName={activePage.name}
        viewport={viewport}
        onViewportChange={setViewport}
      />
      <div className="editor-shell__body">
        <LeftSidebar
          activeTool={activeTool}
          onToolChange={toggleToolPanel}
          onPanelAction={closeToolPanel}
        />
        <EditorCanvas viewport={viewport} />
      </div>
    </div>
  )
}
