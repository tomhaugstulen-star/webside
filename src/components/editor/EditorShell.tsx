import { useState } from 'react'
import { EditorCanvas } from '../canvas/EditorCanvas'
import { InspectorRail } from '../sidebar/InspectorRail'
import { LeftSidebar } from '../sidebar/LeftSidebar'
import { TopToolbar } from '../toolbar/TopToolbar'
import type { EditorTool, InspectorTool, ViewportMode } from '../../types/editor'

export function EditorShell() {
  const [activeTool, setActiveTool] = useState<EditorTool>('add')
  const [activeInspector, setActiveInspector] = useState<InspectorTool>('design')
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const [viewport, setViewport] = useState<ViewportMode>('desktop')

  const changeInspector = (tool: InspectorTool) => {
    setActiveInspector(tool)
    setIsInspectorOpen(true)
  }

  return (
    <div className="editor-shell">
      <TopToolbar viewport={viewport} onViewportChange={setViewport} />
      <div className="editor-shell__body">
        <LeftSidebar activeTool={activeTool} onToolChange={setActiveTool} />
        <EditorCanvas viewport={viewport} />
        <InspectorRail
          activeTool={activeInspector}
          isOpen={isInspectorOpen}
          onToolChange={changeInspector}
          onToggle={() => setIsInspectorOpen((current) => !current)}
        />
      </div>
    </div>
  )
}
