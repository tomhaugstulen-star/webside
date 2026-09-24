import { useCallback, useEffect, useState } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { ElementCreationRequest } from '../../model/elementCreation'
import type { EditorElement, ElementKind } from '../../model/editorProject'
import { getSectionContents } from '../../model/sectionContents'
import { useEditorPersistence } from '../../persistence/useEditorPersistence'
import { downloadDuplicateProject } from '../../projectFiles/downloadDuplicateProject'
import { useElementCreation } from '../../state/useElementCreation'
import { useElementDeletion } from '../../state/useElementDeletion'
import { useElementSelection } from '../../state/useElementSelection'
import { useEditorProject } from '../../state/useEditorProject'
import { useImageProperties } from '../../state/useImageProperties'
import type { EditorTool, ViewportMode } from '../../types/editor'
import { EditorCanvas } from '../canvas/EditorCanvas'
import { ConfirmElementDeletionDialog } from '../dialogs/ConfirmElementDeletionDialog'
import { RightPropertiesPanel } from '../properties/RightPropertiesPanel'
import { LeftSidebar } from '../sidebar/LeftSidebar'
import { TopToolbar } from '../toolbar/TopToolbar'
import { PreviewShell } from '../preview/PreviewShell'
import { usePaintLight } from '../../paint/usePaintLight'
import { useElementDeletionShortcut } from './useElementDeletionShortcut'
import { useSelectedImageCropKeyboard } from './useSelectedImageCropKeyboard'
import { getEditorHistoryShortcut } from './editorHistoryShortcut'
import { useStaticSiteExport } from '../../export/useStaticSiteExport'
type DeletionRequest = {
  elementId: string
  kind: ElementKind
  returnFocus: HTMLElement | null
}
export function EditorShell() {
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null)
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewDesktopWidth, setPreviewDesktopWidth] = useState(0)
  const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(null)
  const {
    activePage,
    state,
    dispatch,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useEditorProject()
  const { status: persistenceStatus } = useEditorPersistence()
  const { getImageAsset } = useImageAssetStore()
  const { exporting, exportMessage, setExportMessage, exportSite } = useStaticSiteExport(state.project)
  const { createElement } = useElementCreation()
  const { deleteElement } = useElementDeletion()
  const { selectedElement } = useElementSelection()
  const paint = usePaintLight(selectedElement, activePage.elements, createElement)
  const { updateImageTransform } = useImageProperties()
  const deletionDialogOpen = deletionRequest !== null
  const deletionTarget = deletionRequest
    ? activePage.elements.find(
        (element) => element.id === deletionRequest.elementId,
      ) ?? null
    : null
  const deletionContents = deletionTarget?.kind === 'section'
    ? getSectionContents(deletionTarget, activePage.elements)
    : []
  const toggleToolPanel = (tool: EditorTool) => {
    setActiveTool((currentTool) => (currentTool === tool ? null : tool))
  }
  const closeToolPanel = () => {
    setActiveTool(null)
  }
  const changeActivePage = (pageId: string) => {
    dispatch({ type: 'set-active-page', pageId })
    closeToolPanel()
    setPropertiesPanelOpen(false)
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
    if (!deletionRequest || !deletionTarget || deletionTarget.locked ||
      deletionContents.some((element) => element.locked)) {
      return
    }

    deleteElement(deletionRequest.elementId)
    setPropertiesPanelOpen(false)
    setDeletionRequest(null)
  }

  useElementDeletionShortcut({
    element: previewOpen || paint.active ? null : selectedElement,
    onRequestDeletion: requestElementDeletion,
  })
  useSelectedImageCropKeyboard({
    element: selectedElement,
    disabled: deletionDialogOpen || previewOpen || paint.active,
    onCommitTransform: updateImageTransform,
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const historyShortcut = getEditorHistoryShortcut(event)

      if (!previewOpen && !paint.active && historyShortcut === 'undo' && canUndo) {
        event.preventDefault()
        undo()
        return
      }

      if (!previewOpen && !paint.active && historyShortcut === 'redo' && canRedo) {
        event.preventDefault()
        redo()
        return
      }

      if (event.key === 'Escape' && previewOpen) {
        setPreviewOpen(false)
        return
      }

      if (event.key === 'Escape' && !deletionDialogOpen && !paint.active) {
        setActiveTool(null)
        setPropertiesPanelOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canRedo, canUndo, deletionDialogOpen, paint.active, previewOpen, redo, undo])

  const duplicateProject = useCallback(() => {
    void downloadDuplicateProject(state.project, getImageAsset)
      .then((created) => {
        if (!created) {
          window.alert('Prosjektkopien kunne ikke opprettes. Kontroller bildene.')
        }
      })
      .catch(() => {
        window.alert('Prosjektkopien kunne ikke opprettes.')
      })
  }, [getImageAsset, state.project])

  if (previewOpen) {
    return (
      <PreviewShell
        viewport={viewport}
        desktopCanvasWidth={previewDesktopWidth}
        onViewportChange={setViewport}
        onClose={() => setPreviewOpen(false)}
      />
    )
  }

  const visiblePropertiesElement =
    propertiesPanelOpen && selectedElement ? selectedElement : null

  return (
    <div
      className={`editor-shell${activeTool ? ' editor-shell--panel-open' : ''}${visiblePropertiesElement ? ' editor-shell--properties-open' : ''}`}
    >
      <TopToolbar
        pages={state.project.pages}
        activePageId={state.activePageId}
        viewport={viewport}
        onPageChange={changeActivePage}
        onViewportChange={setViewport}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        persistenceStatus={persistenceStatus}
        onDuplicateProject={duplicateProject}
        onPreview={() => {
          setActiveTool(null)
          setPropertiesPanelOpen(false)
          setPreviewOpen(true)
        }}
        onEditImage={() => {
          setPropertiesPanelOpen(false)
          paint.open()
        }}
        onExport={() => void exportSite()}
        exporting={exporting}
        onProjectSettings={() => setActiveTool('settings')}
      />
      {exportMessage && <div className="site-export-message" role="status"><span>{exportMessage}</span><button type="button" aria-label="Lukk eksportmelding" onClick={() => setExportMessage(null)}>×</button></div>}
      <div className="editor-shell__body">
        <LeftSidebar
          activeTool={activeTool}
          onToolChange={toggleToolPanel}
          onCreateElement={createElementAndClosePanel}
        />
        <EditorCanvas
          viewport={viewport}
          onWorkspacePointerDown={closeToolPanel}
          onOpenProperties={() => setPropertiesPanelOpen(true)}
          onCloseProperties={() => setPropertiesPanelOpen(false)}
          onCanvasWidthChange={setPreviewDesktopWidth}
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
          containedCount={deletionContents.length}
          containsLockedElement={deletionContents.some((element) => element.locked)}
          onCancel={cancelElementDeletion}
          onConfirm={confirmElementDeletion}
        />
      )}
      {paint.dialog}
    </div>
  )
}
