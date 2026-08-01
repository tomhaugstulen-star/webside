import { useCallback, useEffect, useState } from 'react'
import type { ElementCreationRequest } from '../../model/elementCreation'
import type { EditorElement, ElementKind } from '../../model/editorProject'
import { usePersistence } from '../../persistence/usePersistence'
import { useEditorProject } from '../../state/useEditorProject'
import { useElementCreation } from '../../state/useElementCreation'
import { useElementDeletion } from '../../state/useElementDeletion'
import { useElementSelection } from '../../state/useElementSelection'
import { useImageProperties } from '../../state/useImageProperties'
import type { EditorTool, ViewportMode } from '../../types/editor'
import { EditorCanvas } from '../canvas/EditorCanvas'
import { ConfirmElementDeletionDialog } from '../dialogs/ConfirmElementDeletionDialog'
import { ConfirmProjectResetDialog } from '../dialogs/ConfirmProjectResetDialog'
import { RightPropertiesPanel } from '../properties/RightPropertiesPanel'
import { LeftSidebar } from '../sidebar/LeftSidebar'
import { TopToolbar } from '../toolbar/TopToolbar'
import { useElementDeletionShortcut } from './useElementDeletionShortcut'
import { useSelectedImageCropKeyboard } from './useSelectedImageCropKeyboard'

type DeletionRequest = {
  elementId: string
  kind: ElementKind
  returnFocus: HTMLElement | null
}

export function EditorShell() {
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null)
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false)
  const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(
    null,
  )
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const { activePage } = useEditorProject()
  const { createElement } = useElementCreation()
  const { deleteElement } = useElementDeletion()
  const { selectedElement } = useElementSelection()
  const { updateImageTransform } = useImageProperties()
  const { status, saveNow, resetLocalProject } = usePersistence()
  const deletionDialogOpen = deletionRequest !== null
  const modalDialogOpen = deletionDialogOpen || resetDialogOpen
  const deletionTarget = deletionRequest
    ? activePage.elements.find(
        (element) => element.id === deletionRequest.elementId,
      ) ?? null
    : null

  const toggleToolPanel = (tool: EditorTool) => {
    setActiveTool((currentTool) => (currentTool === tool ? null : tool))
  }

  const closeToolPanel = () => {
    setActiveTool(null)
  }

  const createElementAndClosePanel = (request: ElementCreationRequest) => {
    const created = createElement(request)

    if (created) {
      closeToolPanel()
    }

    return created
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
    setPropertiesPanelOpen(false)
    setDeletionRequest(null)
  }

  const confirmProjectReset = async () => {
    setResetting(true)
    const reset = await resetLocalProject()

    if (!reset) {
      setResetting(false)
    }
  }

  useElementDeletionShortcut({
    element: modalDialogOpen ? null : selectedElement,
    onRequestDeletion: requestElementDeletion,
  })
  useSelectedImageCropKeyboard({
    element: selectedElement,
    disabled: modalDialogOpen,
    onCommitTransform: updateImageTransform,
  })

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !modalDialogOpen) {
        setActiveTool(null)
        setPropertiesPanelOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [modalDialogOpen])

  const visiblePropertiesElement =
    propertiesPanelOpen && selectedElement ? selectedElement : null

  return (
    <div
      className={`editor-shell${activeTool ? ' editor-shell--panel-open' : ''}${visiblePropertiesElement ? ' editor-shell--properties-open' : ''}`}
    >
      <TopToolbar
        pageName={activePage.name}
        viewport={viewport}
        persistenceStatus={status}
        onViewportChange={setViewport}
        onSave={saveNow}
        onResetProject={() => setResetDialogOpen(true)}
      />
      <div className="editor-shell__body">
        <LeftSidebar
          activeTool={activeTool}
          onToolChange={toggleToolPanel}
          onPanelAction={closeToolPanel}
          onCreateElement={createElementAndClosePanel}
        />
        <EditorCanvas
          viewport={viewport}
          onOpenProperties={() => setPropertiesPanelOpen(true)}
          onCloseProperties={() => setPropertiesPanelOpen(false)}
        />
        <RightPropertiesPanel
          element={visiblePropertiesElement}
          onClose={() => setPropertiesPanelOpen(false)}
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
      {resetDialogOpen && (
        <ConfirmProjectResetDialog
          busy={resetting}
          onCancel={() => setResetDialogOpen(false)}
          onConfirm={() => void confirmProjectReset()}
        />
      )}
    </div>
  )
}
