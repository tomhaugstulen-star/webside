import type { RefObject } from 'react'

type Props = {
  importInputRef: RefObject<HTMLInputElement | null>
  ready: boolean
  importPending: boolean
  busy: boolean
  fullscreen: boolean
  saveMenuOpen: boolean
  canUndo: boolean
  canRedo: boolean
  hasSelection: boolean
  canPaste: boolean
  onImportFile: (file: File) => void
  onMergeImport: () => void
  onCancelImport: () => void
  onToggleSaveMenu: () => void
  onSave: () => void
  onExport: () => void
  onUndo: () => void
  onRedo: () => void
  onCopy: () => void
  onCut: () => void
  onPaste: () => void
  onCrop: () => void
  onOpenAi: () => void
  onToggleFullscreen: () => void
  onClose: () => void
}

export function PaintLightToolbar({
  importInputRef, ready, importPending, busy, fullscreen, saveMenuOpen,
  canUndo, canRedo, hasSelection, canPaste, onImportFile, onMergeImport,
  onCancelImport, onToggleSaveMenu, onSave, onExport, onUndo, onRedo,
  onCopy, onCut, onPaste, onCrop, onOpenAi, onToggleFullscreen, onClose,
}: Props) {
  return (
    <header className="paint-dialog__header">
      <div className="paint-dialog__header-left">
        <div className="paint-dialog__header-title"><h2>Rediger bilde</h2></div>
        <button type="button" className="paint-dialog__ai-button"
          disabled={!ready || importPending} onClick={onOpenAi}>AI</button>
        <input ref={importInputRef} className="paint-dialog__file-input" type="file"
          accept="image/png,image/jpeg,image/webp" aria-label="Velg bilde til lerret"
          onChange={(event) => {
            const next = event.target.files?.[0]
            event.target.value = ''
            if (next) onImportFile(next)
          }} />
        <button type="button" disabled={!ready || importPending}
          onClick={() => importInputRef.current?.click()}>Importer til lerret…</button>
        {importPending && <>
          <button type="button" onClick={onMergeImport}>Slå sammen</button>
          <button type="button" onClick={onCancelImport}>Fjern import</button>
        </>}
        <div className="paint-dialog__save-menu">
          <button type="button" aria-haspopup="menu" aria-expanded={saveMenuOpen}
            disabled={!ready || busy || importPending}
            onClick={onToggleSaveMenu}>Lagre</button>
          {saveMenuOpen && (
            <div className="paint-dialog__save-menu-popover paint-dialog__save-menu-popover--header"
              role="menu">
              <button type="button" role="menuitem" onClick={onSave}>
                Lagre som nytt bilde på siden
              </button>
              <button type="button" role="menuitem" onClick={onExport}>
                Eksporter til fil…
              </button>
            </div>
          )}
        </div>
        <div className="paint-dialog__selection-actions" aria-label="Markering">
          <button type="button" disabled={!hasSelection || importPending} onClick={onCopy}>Kopier</button>
          <button type="button" disabled={!hasSelection || importPending} onClick={onCut}>Klipp ut</button>
          <button type="button" disabled={!canPaste || importPending} onClick={onPaste}>Lim inn</button>
          <button type="button" disabled={!hasSelection || importPending} onClick={onCrop}>Beskjær</button>
        </div>
      </div>
      <div className="paint-dialog__history-actions" aria-label="Historikk">
        <button type="button" className="paint-dialog__icon-button"
          aria-label="Angre" title="Angre" disabled={!canUndo || importPending}
          onClick={onUndo}><span aria-hidden="true">↶</span></button>
        <button type="button" className="paint-dialog__icon-button"
          aria-label="Gjør om" title="Gjør om" disabled={!canRedo || importPending}
          onClick={onRedo}><span aria-hidden="true">↷</span></button>
      </div>
      <div className="paint-dialog__header-actions">
        <button type="button" onClick={onToggleFullscreen}>
          {fullscreen ? 'Avslutt fullskjerm' : 'Fullskjerm'}
        </button>
        <button type="button" onClick={onClose} disabled={busy} aria-label="Lukk bildeeditor">Lukk</button>
      </div>
    </header>
  )
}
