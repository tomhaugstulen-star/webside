import { useEffect, useState } from 'react'
import type { ElementKind } from '../../model/editorProject'
import { useElementCreation } from '../../state/useElementCreation'
import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import type { EditorTool, ViewportMode } from '../../types/editor'
import { EditorCanvas } from '../canvas/EditorCanvas'
import { RightPropertiesPanel } from '../properties/RightPropertiesPanel'
import { LeftSidebar } from '../sidebar/LeftSidebar'
import { TopToolbar } from '../toolbar/TopToolbar'

export function EditorShell() {
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null)
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const { activePage } = useEditorProject()
  const { createElement } = useElementCreation()
  const { selectedElement } = useElementSelection()

  const toggleToolPanel = (tool: EditorTool) => {
    setActiveTool((currentTool) => (currentTool === tool ? null : tool))
  }

  const closeToolPanel = () => {
    setActiveTool(null)
  }

  const createElementAndClosePanel = (kind: ElementKind) => {
    createElement(kind)
    closeToolPanel()
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
    <div
      className={`editor-shell${activeTool ? ' editor-shell--panel-open' : ''}${selectedElement ? ' editor-shell--properties-open' : ''}`}
    >
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
          onCreateElement={createElementAndClosePanel}
        />
        <EditorCanvas viewport={viewport} />
        <RightPropertiesPanel element={selectedElement} />
      </div>
    </div>
  )
}
