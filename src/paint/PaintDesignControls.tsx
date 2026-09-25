export type PaintFill =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; colors: [string, string, string]; angle: number }

type Props = {
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
}

export function PaintDesignControls({
  fill,
  textValue,
  textColor,
  textSize,
  textActive,
  disabled,
  onFillChange,
  onFillBackground,
  onTextValueChange,
  onTextColorChange,
  onTextSizeChange,
  onActivateText,
}: Props) {
  const gradient = fill.type === 'gradient' ? fill : null
  const preview = gradient
    ? `linear-gradient(${gradient.angle}deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 50%, ${gradient.colors[2]} 100%)`
    : fill.color

  return (
    <>
      <div className="paint-dialog__panel-group">
        <h3>Farger</h3>
        <div className="paint-dialog__fill-mode" role="group" aria-label="Bakgrunnstype">
          <button type="button" aria-pressed={fill.type === 'solid'} disabled={disabled}
            onClick={() => onFillChange({
              type: 'solid',
              color: gradient?.colors[0] ?? fill.color,
            })}>
            Helfarge
          </button>
          <button type="button" aria-pressed={fill.type === 'gradient'} disabled={disabled}
            onClick={() => onFillChange(fill.type === 'gradient' ? fill : {
              type: 'gradient',
              colors: [fill.color, fill.color, fill.color],
              angle: 180,
            })}>
            Gradient
          </button>
        </div>
        <div className="paint-dialog__fill-preview" style={{ background: preview }} />

        {fill.type === 'solid' ? (
          <label>
            Bakgrunn
            <input type="color" value={fill.color} disabled={disabled}
              onChange={(event) => onFillChange({ type: 'solid', color: event.target.value })} />
          </label>
        ) : (
          <>
            {fill.colors.map((color, index) => (
              <label key={index}>
                Farge {index + 1}
                <input type="color" value={color} disabled={disabled}
                  onChange={(event) => {
                    const colors = [...fill.colors] as [string, string, string]
                    colors[index] = event.target.value
                    onFillChange({ ...fill, colors })
                  }} />
              </label>
            ))}
            <label>
              Vinkel
              <input type="number" min="0" max="360" step="1" value={fill.angle}
                disabled={disabled}
                onChange={(event) => onFillChange({
                  ...fill,
                  angle: Math.max(0, Math.min(360, Number(event.target.value) || 0)),
                })} />
            </label>
          </>
        )}
        <button type="button" disabled={disabled} onClick={onFillBackground}>
          Fyll canvas
        </button>
      </div>

      <div className="paint-dialog__panel-group">
        <h3>Tekst</h3>
        <label className="paint-dialog__stacked-label">
          Tekst
          <textarea value={textValue} rows={3} maxLength={300} disabled={disabled}
            placeholder="Skriv tekst…"
            onChange={(event) => onTextValueChange(event.target.value)} />
        </label>
        <label>Farge <input type="color" value={textColor} disabled={disabled}
          onChange={(event) => onTextColorChange(event.target.value)} /></label>
        <label>Størrelse <input type="number" min="8" max="300" value={textSize}
          disabled={disabled}
          onChange={(event) => onTextSizeChange(
            Math.max(8, Math.min(300, Number(event.target.value) || 8)),
          )} /></label>
        <button type="button" aria-pressed={textActive}
          disabled={disabled || !textValue.trim()} onClick={onActivateText}>
          {textActive ? 'Klikk på canvas for å plassere' : 'Plasser tekst'}
        </button>
      </div>
    </>
  )
}
