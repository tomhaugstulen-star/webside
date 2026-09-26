import { PaintAngleWheel } from './PaintAngleWheel'
import type { PaintDesignPanel } from './PaintDesignDialog'
import type { PaintFill } from './paintFill'

type Props = {
  panel: PaintDesignPanel
  fill: PaintFill
  textValue: string
  textColor: string
  textSize: number
  textActive: boolean
  disabled: boolean
  onFillChange: (fill: PaintFill) => void
  onFillBackground: () => void
  onTextValueChange: (value: string) => void
  onTextColorChange: (color: string) => void
  onTextSizeChange: (size: number) => void
  onActivateText: () => void
  onCommitText: () => void
}

export function PaintDesignControls({
  panel, fill, textValue, textColor, textSize, textActive, disabled,
  onFillChange, onFillBackground, onTextValueChange, onTextColorChange,
  onTextSizeChange, onActivateText, onCommitText,
}: Props) {
  const gradient = fill.type === 'gradient' ? fill : null
  const solidColor = fill.type === 'solid' ? fill.color : gradient?.colors[0] ?? '#ffffff'
  const preview = gradient
    ? `linear-gradient(${gradient.angle}deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 50%, ${gradient.colors[2]} 100%)`
    : solidColor

  if (panel === 'colors') {
    return (
      <div className="paint-design-dialog__body">
        <div className="paint-dialog__fill-mode" role="group" aria-label="Bakgrunnstype">
          <button type="button" aria-pressed={fill.type === 'solid'} disabled={disabled}
            onClick={() => onFillChange({
              type: 'solid',
              color: solidColor,
            })}>Helfarge</button>
          <button type="button" aria-pressed={fill.type === 'gradient'} disabled={disabled}
            onClick={() => onFillChange(fill.type === 'gradient' ? fill : {
              type: 'gradient', colors: [solidColor, solidColor, solidColor], angle: 180,
            })}>Gradient</button>
        </div>
        <div className="paint-dialog__fill-preview" style={{ background: preview }} />
        {fill.type === 'solid' ? (
          <label>Bakgrunn <input type="color" value={fill.color} disabled={disabled}
            onChange={(event) => onFillChange({
              type: 'solid', color: event.target.value,
            })} /></label>
        ) : (
          <>
            {fill.colors.map((color, index) => (
              <label key={index}>Farge {index + 1}
                <input type="color" value={color} disabled={disabled}
                  onChange={(event) => {
                    const colors = [...fill.colors] as [string, string, string]
                    colors[index] = event.target.value
                    onFillChange({ ...fill, colors })
                  }} />
              </label>
            ))}
            <label className="paint-dialog__stacked-label">Vinkel
              <PaintAngleWheel angle={fill.angle} disabled={disabled}
                onChange={(angle) => onFillChange({ ...fill, angle })} />
            </label>
          </>
        )}
        <button type="button" disabled={disabled} onClick={onFillBackground}>
          Fyll canvas
        </button>
      </div>
    )
  }

  return (
    <div className="paint-design-dialog__body">
      <label className="paint-dialog__stacked-label">Tekst
        <textarea value={textValue} rows={5} maxLength={300} disabled={disabled}
          placeholder="Skriv tekst…" onChange={(event) => onTextValueChange(event.target.value)} />
      </label>
      <label>Farge <input type="color" value={textColor} disabled={disabled}
        onChange={(event) => onTextColorChange(event.target.value)} /></label>
      <label>Størrelse <input type="number" min="8" max="300" value={textSize}
        disabled={disabled} onChange={(event) => onTextSizeChange(
          Math.max(8, Math.min(300, Number(event.target.value) || 8)),
        )} /></label>
      <button type="button" aria-pressed={textActive}
        disabled={disabled || !textValue.trim()} onClick={onActivateText}>
        {textActive ? 'Tekstramme aktiv' : 'Vis tekstramme'}
      </button>
      <button type="button" disabled={disabled || !textActive || !textValue.trim()}
        onClick={onCommitText}>
        Fest tekst på canvas
      </button>
    </div>
  )
}
