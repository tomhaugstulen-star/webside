import { useEffect, useRef, useState } from 'react'
import type { SupportedImageMimeType } from '../model/imageAsset'
import { canvasToFile, saveCanvasWithPicker } from './paintCanvasFiles'
import { validDimensions, type PaintTool, type Point } from './paintGeometry'
import { PaintAiDialog } from './PaintAiDialog'
import { PaintCanvasViewport } from './PaintCanvasViewport'
import { PaintDesignDialog } from './PaintDesignDialog'
import type { PaintDesignPanel } from './paintDesignPanel'
import type { PaintFill } from './paintFill'
import { PaintFileControls } from './PaintFileControls'
import { PaintLightToolbar } from './PaintLightToolbar'
import { PaintResizeControls } from './PaintResizeControls'
import { usePaintCanvas } from './usePaintCanvas'
import { usePaintImport } from './usePaintImport'
type Props = { file: File; dimensions: { width: number; height: number }; onClose: () => void; onSave: (file: File) => Promise<void> }
const tools: Array<{ id: PaintTool; label: string }> = [
  { id: 'select', label: 'Marker / flytt' }, { id: 'brush', label: 'Pensel' },
  { id: 'eraser', label: 'Viskelær' }, { id: 'line', label: 'Strek' },
  { id: 'rectangle', label: 'Rektangel' },
]
export function PaintLightDialog({ file, dimensions, onClose, onSave }: Props) {
  const [tool, setTool] = useState<PaintTool>('select')
  const [color, setColor] = useState('#17202c'), [size, setSize] = useState(8)
  const [fill, setFill] = useState<PaintFill>({ type: 'solid', color: '#ffffff' })
  const [textValue, setTextValue] = useState(''), [textColor, setTextColor] = useState('#17202c')
  const [textSize, setTextSize] = useState(48)
  const [textFramePosition, setTextFramePosition] = useState<Point>({ x: 80, y: 80 })
  const [name, setName] = useState(file.name.replace(/\.[^.]+$/, '') + '-redigert')
  const [format, setFormat] = useState<SupportedImageMimeType>('image/png')
  const [newWidth, setNewWidth] = useState(dimensions.width)
  const [newHeight, setNewHeight] = useState(dimensions.height), [lockRatio, setLockRatio] = useState(true)
  const [busy, setBusy] = useState(false), [fullscreen, setFullscreen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false), [designPanel, setDesignPanel] = useState<PaintDesignPanel | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [saveMenuOpen, setSaveMenuOpen] = useState(false)
  const [canvasViewport, setCanvasViewport] = useState({ width: 0, height: 0 })
  const { canvasRef, overlayRef, ...paint } = usePaintCanvas(
    file, tool, color, size, textValue, textColor, textSize,
  )
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
        if (aiOpen) setAiOpen(false)
        else if (designPanel) setDesignPanel(null)
        else if (importPending) importActions.cancel()
        else if (fullscreen) setFullscreen(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', onEscape, true)
    return () => window.removeEventListener('keydown', onEscape, true)
  }, [aiOpen, busy, designPanel, fullscreen, importPending, importActions, onClose])
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
  const fitScale = paint.width > 0 && paint.height > 0 &&
    canvasViewport.width > 0 && canvasViewport.height > 0
    ? Math.min(1, Math.max(1, canvasViewport.width - 24) / paint.width,
      Math.max(1, canvasViewport.height - 24) / paint.height)
    : 1
  const displayWidth = Math.max(1, Math.round((paint.width || 1) * fitScale))
  const displayHeight = Math.max(1, Math.round((paint.height || 1) * fitScale))
  const applyResize = () => {
    if (!validDimensions(newWidth, newHeight)) {
      setMessage('Bruk hele piksler, maks 16 384 per side og 40 megapiksler.')
      return
    }
    if ((newWidth > paint.width || newHeight > paint.height) &&
      !window.confirm('Du oppskalerer bildet. Det kan bli mindre skarpt. Fortsette?')) return
    paint.resize(newWidth, newHeight)
    setMessage(null)
  }
  return (
    <div className="paint-backdrop">
      <section className={`paint-dialog${fullscreen ? ' paint-dialog--fullscreen' : ''}`}
        role="dialog" aria-modal="true" aria-label="Rediger bilde">
        <PaintLightToolbar
          importInputRef={importInputRef}
          ready={paint.ready}
          importPending={importPending}
          busy={busy}
          fullscreen={fullscreen}
          saveMenuOpen={saveMenuOpen}
          canUndo={paint.canUndo}
          canRedo={paint.canRedo}
          hasSelection={!!paint.selection}
          canPaste={paint.canPaste}
          onImportFile={(next) => {
            void importActions.importFile(next).then(() => {
              paint.clearSelection()
              setTool('select')
              setMessage(null)
            }).catch((error: unknown) => setMessage(
              error instanceof Error ? error.message : 'Bildet kunne ikke importeres.',
            ))
          }}
          onMergeImport={importActions.merge}
          onCancelImport={importActions.cancel}
          onToggleSaveMenu={() => setSaveMenuOpen((open) => !open)}
          onSave={() => {
            setSaveMenuOpen(false)
            void save()
          }}
          onExport={() => {
            setSaveMenuOpen(false)
            void exportFile()
          }}
          onUndo={() => void paint.undo()}
          onRedo={() => void paint.redo()}
          onCopy={paint.copy}
          onCut={paint.cut}
          onPaste={paint.paste}
          onCrop={paint.crop}
          onOpenAi={() => setAiOpen(true)}
          onToggleFullscreen={() => setFullscreen(!fullscreen)}
          onClose={onClose}
        />
        <div className="paint-dialog__workspace">
          <aside className="paint-dialog__sidebar" aria-label="Bildeverktøy og innstillinger">
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
            </div>
            <div className="paint-dialog__panel-group">
              <h3>Design</h3>
              <button type="button" disabled={!paint.ready || importPending}
                onClick={() => setDesignPanel('colors')}>Farger…</button>
              <button type="button" disabled={!paint.ready || importPending}
                onClick={() => setDesignPanel('text')}>Tekst…</button>
            </div>
            <PaintResizeControls fileName={file.name} width={paint.width}
              height={paint.height} newWidth={newWidth} newHeight={newHeight}
              lockRatio={lockRatio} ready={paint.ready} importPending={importPending}
              onWidthChange={(value) => setDimension('width', value)}
              onHeightChange={(value) => setDimension('height', value)}
              onLockRatioChange={setLockRatio} onApply={applyResize}
              onHeroPreset={() => { setNewWidth(1920); setNewHeight(1080); setLockRatio(false) }} />
            <PaintFileControls name={name} format={format}
              message={message} error={paint.error}
              onNameChange={setName} onFormatChange={setFormat} />
          </aside>
          <PaintCanvasViewport viewportRef={canvasViewportRef} canvasRef={canvasRef}
            overlayRef={overlayRef} importOverlayRef={importOverlayRef}
            width={displayWidth} height={displayHeight} canvasWidth={paint.width}
            canvasHeight={paint.height} importPending={importPending}
            textFrame={tool === 'text' && textValue.trim()
              ? { value: textValue, color: textColor, size: textSize, position: textFramePosition }
              : null}
            onTextFrameMove={setTextFramePosition}
            onTextFrameCommit={() => {
              paint.addText(textFramePosition)
              setTool('select')
            }}
            onPointerDown={paint.onPointerDown}
            onPointerMove={paint.onPointerMove} onPointerUp={paint.onPointerUp}
            onImportPointerDown={importActions.onPointerDown}
            onImportPointerMove={importActions.onPointerMove}
            onImportPointerUp={importActions.onPointerUp} />
        </div>
        {designPanel && (
          <PaintDesignDialog panel={designPanel} fill={fill} textValue={textValue}
            textColor={textColor} textSize={textSize} textActive={tool === 'text'}
            disabled={!paint.ready || importPending} onFillChange={setFill}
            onFillBackground={() => paint.fillBackground(fill)}
            onTextValueChange={setTextValue} onTextColorChange={setTextColor}
            onTextSizeChange={setTextSize}
            onActivateText={() => {
              setTextFramePosition({ x: Math.round(paint.width * 0.12),
                y: Math.round(paint.height * 0.12) })
              setTool('text')
            }}
            onClose={() => setDesignPanel(null)} />
        )}
        {aiOpen && (
          <PaintAiDialog
            canvasRef={canvasRef}
            disabled={!paint.ready || importPending}
            onClose={() => setAiOpen(false)}
          />
        )}
      </section>
    </div>
  )
}
