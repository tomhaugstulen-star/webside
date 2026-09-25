type Props = {
  backgroundColor: string
  textValue: string
  textColor: string
  textSize: number
  textActive: boolean
  disabled: boolean
  onBackgroundColorChange: (color: string) => void
  onFillBackground: () => void
  onTextValueChange: (value: string) => void
  onTextColorChange: (color: string) => void
  onTextSizeChange: (size: number) => void
  onActivateText: () => void
}

export function PaintDesignControls({
  backgroundColor,
  textValue,
  textColor,
  textSize,
  textActive,
  disabled,
  onBackgroundColorChange,
  onFillBackground,
  onTextValueChange,
  onTextColorChange,
  onTextSizeChange,
  onActivateText,
}: Props) {
  return (
    <>
      <div className="paint-dialog__panel-group">
        <h3>Farger</h3>
        <label>
          Bakgrunn
          <input
            type="color"
            value={backgroundColor}
            disabled={disabled}
            onChange={(event) => onBackgroundColorChange(event.target.value)}
          />
        </label>
        <button type="button" disabled={disabled} onClick={onFillBackground}>
          Fyll canvas
        </button>
      </div>

      <div className="paint-dialog__panel-group">
        <h3>Tekst</h3>
        <label className="paint-dialog__stacked-label">
          Tekst
          <textarea
            value={textValue}
            rows={3}
            maxLength={300}
            disabled={disabled}
            placeholder="Skriv tekst…"
            onChange={(event) => onTextValueChange(event.target.value)}
          />
        </label>
        <label>
          Farge
          <input
            type="color"
            value={textColor}
            disabled={disabled}
            onChange={(event) => onTextColorChange(event.target.value)}
          />
        </label>
        <label>
          Størrelse
          <input
            type="number"
            min="8"
            max="300"
            value={textSize}
            disabled={disabled}
            onChange={(event) =>
              onTextSizeChange(
                Math.max(8, Math.min(300, Number(event.target.value) || 8)),
              )
            }
          />
        </label>
        <button
          type="button"
          aria-pressed={textActive}
          disabled={disabled || !textValue.trim()}
          onClick={onActivateText}
        >
          {textActive ? 'Klikk på canvas for å plassere' : 'Plasser tekst'}
        </button>
      </div>
    </>
  )
}
