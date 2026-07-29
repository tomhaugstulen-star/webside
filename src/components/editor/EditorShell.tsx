import { useCallback, useEffect, useState } from 'react'
import type { ElementCreationRequest } from '../../model/elementCreation'
import type { EditorElement, ElementKind } from '../../model/editorProject'
import { useElementCreation } from '../../state/useElementCreation'
import { useElementDeletion } from '../../state/useElementDeletion'
import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import type { EditorTool, ViewportMode } from '../../types/editor'
import { EditorCanvas } from '../canvas/EditorCanvas'
import { ConfirmElementDeletionDialog } from '../dialogs/ConfirmElementDeletionDialog'
import { RightPropertiesPanel } from '../properties/RightPropertiesPanel'
import { LeftSidebar } from '../sidebar/LeftSidebar'
import { TopToolbar } from '../toolbar/TopToolbar'
import { useElementDeletionShortcut } from './useElementDeletionShortcut'

type DeletionRequest = {
  elementId: string
  kind: ElementKind
  returnFocus: HTMLElement | null
}

export function EditorShell() {
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null)
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(null)
  const { activePage } = useEditorProject()
  const { createElement } = useElementCreation()
  const { deleteElement } = useElementDeletion()
  const { selectedElement } = useElementSelection()
  const deletionDialogOpen = deletionRequest !== null
  const deletionTarget = deletionRequest
    ? activePage.elements.find((element) => element.id === deletionRequest.elementId) ?? null
    : null

  const toggleToolPanel = (tool: EditorTool) => {
    setActiveTool((currentTool) => (currentTool === tool ? null : tool))
  }

  const closeToolPanel = () => {
    setActiveTool(null)
  }

  const createElementAndClosePanel = (
    request: ElementCreationRequest,
  ) => {
    if (createElement(request)) {
      closeToolPanel()
    }
  }

  const requestElementDeletion = useCallback(
    (element: EditorElement, returnFocus: HTMLElement | null) => {
      if (element.locked) {
        return
      }

      setDeletionRequest({
        elementId: element.id,
        kind: element.kind,
        returnFocus,
      })
    },
    [],
  )

  const cancelElementDeletion = useCallback(() => {
    const returnFocus = deletionRequest?.returnFocus ?? null
    setDeletionRequest(null)

    if (returnFocus?.isConnected) {
      requestAnimationFrame(() => returnFocus.focus())
    }
  }, [deletionRequest])

  const confirmElementDeletion = () => {
    if (!deletionRequest || !deletionTarget || deletionTarget.locked) {
      return
    }

    deleteElement(deletionRequest.elementId)
    setDeletionRequest(null)
  }

  useElementDeletionShortcut({
    element: selectedElement,
    onRequestDeletion: requestElementDeletion,
  })

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deletionDialogOpen) {
        setActiveTool(null)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [deletionDialogOpen])

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
        <RightPropertiesPanel
          element={selectedElement}
          onRequestElementDeletion={requestElementDeletion}
        />
      </div>
      {deletionRequest && (
        <ConfirmElementDeletionDialog
          kind={deletionRequest.kind}
          targetExists={deletionTarget !== null}
          targetLocked={deletionTarget?.locked ?? false}
          onCancel={cancelElementDeletion}
          onConfirm={confirmElementDeletion}
        />
      )}
    </div>
  )
}
