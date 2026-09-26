type Props = {
  fileName: string
  width: number
  height: number
  newWidth: number
  newHeight: number
  lockRatio: boolean
  ready: boolean
  importPending: boolean
  onWidthChange: (value: number) => void
  onHeightChange: (value: number) => void
  onLockRatioChange: (value: boolean) => void
  onApply: () => void
  onHeroPreset: () => void
}

export function PaintResizeControls({
  fileName, width, height, newWidth, newHeight, lockRatio, ready,
  importPending, onWidthChange, onHeightChange, onLockRatioChange,
  onApply, onHeroPreset,
}: Props) {
  return (
    <fieldset className="paint-dialog__resize">
      <legend>Bildestørrelse</legend>
      <p className="paint-dialog__meta">{fileName}<br />{width} × {height} px</p>
      <label>Bredde <input type="number" min="1" max="16384" value={newWidth || ''}
        onChange={(event) => onWidthChange(Number(event.target.value))} /></label>
      <label>Høyde <input type="number" min="1" max="16384" value={newHeight || ''}
        onChange={(event) => onHeightChange(Number(event.target.value))} /></label>
      <label><input type="checkbox" checked={lockRatio}
        onChange={(event) => onLockRatioChange(event.target.checked)} /> Lås proporsjoner</label>
      <button type="button" onClick={onApply}
        disabled={!ready || importPending}>Endre størrelse</button>
      <button type="button" disabled={importPending} onClick={onHeroPreset}>
        Hero 16:9 · 1920 × 1080
      </button>
    </fieldset>
  )
}
