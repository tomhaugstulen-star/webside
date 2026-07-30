import type { EditorColor } from '../../model/editorColor'

type ColorSwatchInputProps = {
  id: string
  label: string
  value: EditorColor
  disabled?: boolean
  onChange: (value: string) => void
}

export function ColorSwatchInput({
  id,
  label,
  value,
  disabled = false,
  onChange,
}: ColorSwatchInputProps) {
  return (
    <label className="color-swatch-input" htmlFor={id}>
      <span>{label}</span>
      <span className="color-swatch-input__control">
        <input
          id={id}
          type="color"
          value={value}
          disabled={disabled}
          aria-label={`${label}. Nåværende farge ${value}`}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="color-swatch-input__value" aria-hidden="true">
          {value}
        </span>
      </span>
    </label>
  )
}
