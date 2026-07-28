import { useState } from 'react'
import { EditorCanvas } from '../canvas/EditorCanvas'
import { LeftSidebar } from '../sidebar/LeftSidebar'
import { TopToolbar } from '../toolbar/TopToolbar'
import type { EditorTool, ViewportMode } from '../../types/editor'

export function EditorShell() {
  const [activeTool, setActiveTool] = useState<EditorTool>('design')
  const [viewport, setViewport] = useState<ViewportMode>('desktop')

  return (
    <div className="editor-shell">
      <TopToolbar viewport={viewport} onViewportChange={setViewport} />
      <div className="editor-shell__body">
        <LeftSidebar activeTool={activeTool} onToolChange={setActiveTool} />
        <EditorCanvas viewport={viewport} />
      </div>
    </div>
  )
}
