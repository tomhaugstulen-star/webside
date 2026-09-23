import { useEffect, useState } from 'react'
import type { SupportedImageMimeType } from '../model/imageAsset'
import { canvasToFile, saveCanvasWithPicker } from './paintCanvasFiles'
import { validDimensions, type PaintTool } from './paintGeometry'
import { usePaintCanvas } from './usePaintCanvas'

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
  const [message, setMessage] = useState<string | null>(null)
  const { canvasRef, overlayRef, ...paint } = usePaintCanvas(file, tool, color, size)

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) {
        event.stopImmediatePropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onEscape, true)
    return () => window.removeEventListener('keydown', onEscape, true)
  }, [busy, onClose])

  const fileName = () => {
    const base = name.trim().replace(/\.(png|jpe?g|webp)$/i, '')
    if (!base) throw new Error('Skriv et filnavn.')
    const extension = format === 'image/jpeg' ? 'jpg' : format.split('/')[1]
    return `${base}.${extension}`
  }
  const save = async () => {
    if (!canvasRef.current || busy) return
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
    if (!canvasRef.current || busy) return
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
      <section className="paint-dialog" role="dialog" aria-modal="true" aria-label="Rediger bilde">
        <header className="paint-dialog__header">
          <div><h2>Rediger bilde</h2><p>Originalen beholdes. Endringene lagres som nytt bilde.</p></div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Lukk bildeeditor">Lukk</button>
        </header>
        <div className="paint-dialog__tools" role="group" aria-label="Bildeverktøy">
          {tools.map((item) => (
            <button key={item.id} type="button" aria-pressed={tool === item.id}
              onClick={() => setTool(item.id)}>{item.label}</button>
          ))}
          <label>Farge <input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
          <label>Størrelse <input type="number" min="1" max="100" value={size}
            onChange={(event) => setSize(Math.max(1, Math.min(100, Number(event.target.value) || 1)))} /></label>
        </div>
        <div className="paint-dialog__tools" role="group" aria-label="Markering og historikk">
          <button type="button" disabled={!paint.selection} onClick={paint.copy}>Kopier</button>
          <button type="button" disabled={!paint.selection} onClick={paint.cut}>Klipp ut</button>
          <button type="button" disabled={!paint.canPaste} onClick={paint.paste}>Lim inn</button>
          <button type="button" disabled={!paint.selection} onClick={paint.crop}>Beskjær</button>
          <button type="button" disabled={!paint.canUndo} onClick={() => void paint.undo()}>Angre</button>
          <button type="button" disabled={!paint.canRedo} onClick={() => void paint.redo()}>Gjør om</button>
        </div>
        <div className="paint-dialog__canvas-scroll">
          <div className="paint-dialog__canvas-wrap" style={{ width: paint.width || 1 }}>
            <canvas ref={canvasRef} aria-label="Bildearbeidsflate"
              onPointerDown={paint.onPointerDown} onPointerMove={paint.onPointerMove}
              onPointerUp={paint.onPointerUp} onPointerCancel={paint.onPointerUp} />
            <canvas ref={overlayRef} aria-hidden="true" />
          </div>
        </div>
        <div className="paint-dialog__bottom">
          <fieldset className="paint-dialog__resize">
            <legend>Bildestørrelse · original {file.name} · {paint.width} × {paint.height} px</legend>
            <label>Bredde <input type="number" min="1" max="16384" value={newWidth || ''}
              onChange={(event) => setDimension('width', Number(event.target.value))} /></label>
            <label>Høyde <input type="number" min="1" max="16384" value={newHeight || ''}
              onChange={(event) => setDimension('height', Number(event.target.value))} /></label>
            <label><input type="checkbox" checked={lockRatio}
              onChange={(event) => setLockRatio(event.target.checked)} /> Lås proporsjoner</label>
            <button type="button" onClick={applyResize} disabled={!paint.ready}>Endre størrelse</button>
            <button type="button" onClick={() => {
              setNewWidth(1920); setNewHeight(1080); setLockRatio(false)
            }}>Hero 16:9 · 1920 × 1080</button>
          </fieldset>
          <div className="paint-dialog__save">
            <label>Filnavn <input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label>Format <select value={format} onChange={(event) =>
              setFormat(event.target.value as SupportedImageMimeType)}>
              <option value="image/png">PNG</option><option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select></label>
            <button type="button" disabled={!paint.ready || busy} onClick={() => void save()}>Lagre som nytt bilde på siden</button>
            <button type="button" disabled={!paint.ready || busy} onClick={() => void exportFile()}>Eksporter til fil…</button>
          </div>
        </div>
        {(message || paint.error) && <p className="paint-dialog__message" role="status">{message || paint.error}</p>}
      </section>
    </div>
  )
}
