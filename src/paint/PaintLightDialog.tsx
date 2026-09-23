import { useEffect, useRef, useState } from 'react'
import type { SupportedImageMimeType } from '../model/imageAsset'
import { canvasToFile, saveCanvasWithPicker } from './paintCanvasFiles'
import { validDimensions, type PaintTool } from './paintGeometry'
import { usePaintCanvas } from './usePaintCanvas'
import { usePaintImport } from './usePaintImport'

type Props = {
  file: File
  dimensions: { width: number; height: number }
  onClose: () => void
  onSave: (file: File) => Promise<void>
}

const tools: Array<{ id: PaintTool; label: string }> = [
  { id: 'select', label: 'Marker / flytt' },
  { id: 'brush', label: 'Pensel' },
  { id: 'eraser', label: 'Viskelær' },
  { id: 'line', label: 'Strek' },
  { id: 'rectangle', label: 'Rektangel' },
]

export function PaintLightDialog({ file, dimensions, onClose, onSave }: Props) {
  const [tool, setTool] = useState<PaintTool>('select')
  const [color, setColor] = useState('#17202c')
  const [size, setSize] = useState(8)
  const [name, setName] = useState(file.name.replace(/\.[^.]+$/, '') + '-redigert')
  const [format, setFormat] = useState<SupportedImageMimeType>('image/png')
  const [newWidth, setNewWidth] = useState(dimensions.width)
  const [newHeight, setNewHeight] = useState(dimensions.height)
  const [lockRatio, setLockRatio] = useState(true)
  const [busy, setBusy] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [saveMenuOpen, setSaveMenuOpen] = useState(false)
  const [canvasViewport, setCanvasViewport] = useState({ width: 0, height: 0 })
  const { canvasRef, overlayRef, ...paint } = usePaintCanvas(file, tool, color, size)
  const { overlayRef: importOverlayRef, imported: importPending, ...importActions } =
    usePaintImport(canvasRef, paint.width, paint.height, paint.commit)
  const importInputRef = useRef<HTMLInputElement>(null)
  const canvasViewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = canvasViewportRef.current
    if (!viewport) return
    const update = () => setCanvasViewport({
      width: viewport.clientWidth,
      height: viewport.clientHeight,
    })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) {
        event.stopImmediatePropagation()
        if (importPending) importActions.cancel()
        else if (fullscreen) setFullscreen(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', onEscape, true)
    return () => window.removeEventListener('keydown', onEscape, true)
  }, [busy, fullscreen, importPending, importActions, onClose])

  const fileName = () => {
    const base = name.trim().replace(/\.(png|jpe?g|webp)$/i, '')
    if (!base) throw new Error('Skriv et filnavn.')
    const extension = format === 'image/jpeg' ? 'jpg' : format.split('/')[1]
    return `${base}.${extension}`
  }
  const save = async () => {
    if (!canvasRef.current || busy || importPending) return
    setBusy(true)
    setMessage(null)
    try {
      const result = await canvasToFile(canvasRef.current, fileName(), format)
      await onSave(result)
      onClose()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Bildet kunne ikke lagres.')
    } finally {
      setBusy(false)
    }
  }
  const exportFile = async () => {
    if (!canvasRef.current || busy || importPending) return
    setBusy(true)
    setMessage(null)
    try {
      await saveCanvasWithPicker(canvasRef.current, fileName(), format)
      setMessage('Bildefilen er lagret i valgt mappe.')
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setMessage(error.message)
      }
    } finally {
      setBusy(false)
    }
  }
  const setDimension = (dimension: 'width' | 'height', value: number) => {
    const ratio = paint.width / paint.height
    if (dimension === 'width') {
      setNewWidth(value)
      if (lockRatio && value > 0) setNewHeight(Math.round(value / ratio))
    } else {
      setNewHeight(value)
      if (lockRatio && value > 0) setNewWidth(Math.round(value * ratio))
    }
  }
  const fitScale = paint.width > 0 && paint.height > 0 && canvasViewport.width > 0 && canvasViewport.height > 0
    ? Math.min(
      1,
      Math.max(1, canvasViewport.width - 24) / paint.width,
      Math.max(1, canvasViewport.height - 24) / paint.height,
    )
    : 1
  const displayWidth = Math.max(1, Math.round((paint.width || 1) * fitScale))
  const displayHeight = Math.max(1, Math.round((paint.height || 1) * fitScale))

  const applyResize = () => {
    if (!validDimensions(newWidth, newHeight)) {
      setMessage('Bruk hele piksler, maks 16 384 per side og 40 megapiksler.')
      return
    }
    if (newWidth > paint.width || newHeight > paint.height) {
      if (!window.confirm('Du oppskalerer bildet. Det kan bli mindre skarpt. Fortsette?')) return
    }
    paint.resize(newWidth, newHeight)
    setMessage(null)
  }

  return (
    <div className="paint-backdrop">
      <section className={`paint-dialog${fullscreen ? ' paint-dialog--fullscreen' : ''}`}
        role="dialog" aria-modal="true" aria-label="Rediger bilde">
        <header className="paint-dialog__header">
          <div className="paint-dialog__header-title"><h2>Rediger bilde</h2></div>
          <div className="paint-dialog__history-actions" aria-label="Historikk">
            <button type="button" className="paint-dialog__icon-button"
              aria-label="Angre" title="Angre" disabled={!paint.canUndo || importPending}
              onClick={() => void paint.undo()}>
              <span aria-hidden="true">↶</span>
            </button>
            <button type="button" className="paint-dialog__icon-button"
              aria-label="Gjør om" title="Gjør om" disabled={!paint.canRedo || importPending}
              onClick={() => void paint.redo()}>
              <span aria-hidden="true">↷</span>
            </button>
          </div>
          <div className="paint-dialog__header-actions">
            <button type="button" onClick={() => setFullscreen(!fullscreen)}>
              {fullscreen ? 'Avslutt fullskjerm' : 'Fullskjerm'}
            </button>
            <button type="button" onClick={onClose} disabled={busy} aria-label="Lukk bildeeditor">Lukk</button>
          </div>
        </header>

        <div className="paint-dialog__workspace">
          <aside className="paint-dialog__sidebar" aria-label="Bildeverktøy og innstillinger">
            <div className="paint-dialog__panel-group paint-dialog__file-actions"
              role="group" aria-label="Filhandlinger">
              <h3>Fil</h3>
              <input ref={importInputRef} className="paint-dialog__file-input" type="file"
                accept="image/png,image/jpeg,image/webp" aria-label="Velg bilde til lerret"
                onChange={(event) => {
                  const next = event.target.files?.[0]
                  event.target.value = ''
                  if (next) void importActions.importFile(next).then(() => {
                    paint.clearSelection()
                    setTool('select')
                    setMessage(null)
                  }).catch((error: unknown) => setMessage(
                    error instanceof Error ? error.message : 'Bildet kunne ikke importeres.',
                  ))
                }} />
              <button type="button" disabled={!paint.ready || importPending}
                onClick={() => importInputRef.current?.click()}>Importer til lerret…</button>
              {importPending && <>
                <span className="paint-dialog__hint">Flytt bildet på lerretet, og slå sammen når det ligger riktig.</span>
                <button type="button" onClick={importActions.merge}>Slå sammen</button>
                <button type="button" onClick={importActions.cancel}>Fjern import</button>
              </>}
              <div className="paint-dialog__save-menu">
                <button type="button" aria-haspopup="menu" aria-expanded={saveMenuOpen}
                  disabled={!paint.ready || busy || importPending}
                  onClick={() => setSaveMenuOpen((open) => !open)}>Lagre</button>
                {saveMenuOpen && (
                  <div className="paint-dialog__save-menu-popover paint-dialog__save-menu-popover--sidebar"
                    role="menu">
                    <button type="button" role="menuitem" onClick={() => {
                      setSaveMenuOpen(false)
                      void save()
                    }}>Lagre som nytt bilde på siden</button>
                    <button type="button" role="menuitem" onClick={() => {
                      setSaveMenuOpen(false)
                      void exportFile()
                    }}>Eksporter til fil…</button>
                  </div>
                )}
              </div>
            </div>

            <div className="paint-dialog__panel-group" role="group" aria-label="Bildeverktøy og markering">
              <h3>Verktøy</h3>
              <div className="paint-dialog__tool-grid">
                {tools.map((item) => (
                  <button key={item.id} type="button" aria-pressed={tool === item.id}
                    disabled={importPending} onClick={() => setTool(item.id)}>{item.label}</button>
                ))}
              </div>
              <label>Farge <input type="color" value={color}
                onChange={(event) => setColor(event.target.value)} /></label>
              <label>Størrelse <input type="number" min="1" max="100" value={size}
                onChange={(event) => setSize(Math.max(1, Math.min(100, Number(event.target.value) || 1)))} /></label>
              <div className="paint-dialog__panel-divider" />
              <h3>Markering</h3>
              <div className="paint-dialog__action-grid paint-dialog__action-grid--compact">
                <button type="button" disabled={!paint.selection || importPending} onClick={paint.copy}>Kopier</button>
                <button type="button" disabled={!paint.selection || importPending} onClick={paint.cut}>Klipp ut</button>
                <button type="button" disabled={!paint.canPaste || importPending} onClick={paint.paste}>Lim inn</button>
                <button type="button" disabled={!paint.selection || importPending} onClick={paint.crop}>Beskjær</button>
              </div>
            </div>

            <fieldset className="paint-dialog__resize">
              <legend>Bildestørrelse</legend>
              <p className="paint-dialog__meta">{file.name}<br />{paint.width} × {paint.height} px</p>
              <label>Bredde <input type="number" min="1" max="16384" value={newWidth || ''}
                onChange={(event) => setDimension('width', Number(event.target.value))} /></label>
              <label>Høyde <input type="number" min="1" max="16384" value={newHeight || ''}
                onChange={(event) => setDimension('height', Number(event.target.value))} /></label>
              <label><input type="checkbox" checked={lockRatio}
                onChange={(event) => setLockRatio(event.target.checked)} /> Lås proporsjoner</label>
              <button type="button" onClick={applyResize}
                disabled={!paint.ready || importPending}>Endre størrelse</button>
              <button type="button" disabled={importPending} onClick={() => {
                setNewWidth(1920); setNewHeight(1080); setLockRatio(false)
              }}>Hero 16:9 · 1920 × 1080</button>
            </fieldset>

            <div className="paint-dialog__save">
              <h3>Fil</h3>
              <label>Filnavn <input value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label>Format <select value={format} onChange={(event) =>
                setFormat(event.target.value as SupportedImageMimeType)}>
                <option value="image/png">PNG</option><option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select></label>
            </div>

            {(message || paint.error) &&
              <p className="paint-dialog__message" role="status">{message || paint.error}</p>}
          </aside>

          <div ref={canvasViewportRef} className="paint-dialog__canvas-scroll">
            <div className="paint-dialog__canvas-wrap"
              style={{ width: displayWidth, height: displayHeight }}>
              <canvas ref={canvasRef} aria-label="Bildearbeidsflate"
                onPointerDown={paint.onPointerDown} onPointerMove={paint.onPointerMove}
                onPointerUp={paint.onPointerUp} onPointerCancel={paint.onPointerUp} />
              <canvas ref={overlayRef} aria-hidden="true" />
              <canvas ref={importOverlayRef} className="paint-dialog__import-overlay"
                aria-label="Flytt importert bilde" style={{ pointerEvents: importPending ? 'auto' : 'none' }}
                onPointerDown={importActions.onPointerDown} onPointerMove={importActions.onPointerMove}
                onPointerUp={importActions.onPointerUp} onPointerCancel={importActions.onPointerUp} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
