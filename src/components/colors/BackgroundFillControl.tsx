import { useState, type KeyboardEvent } from 'react'
import {
  editorFillToCssBackground,
  isEditorGradientAngle,
  toLinearGradientFill,
  toSolidFill,
  type EditorFill,
} from '../../model/editorFill'
import { ColorSwatchInput } from './ColorSwatchInput'

type BackgroundFillControlProps = {
  id: string
  label: string
  fill: EditorFill
  disabled?: boolean
  onChange: (fill: EditorFill) => void
}

export function BackgroundFillControl({
  id,
  label,
  fill,
  disabled = false,
  onChange,
}: BackgroundFillControlProps) {
  const gradient = fill.type === 'linear-gradient' ? fill : null
  const [angleDraft, setAngleDraft] = useState(
    gradient ? String(gradient.angle) : '90',
  )
  const [editingAngle, setEditingAngle] = useState(false)
  const displayedAngle = editingAngle
    ? angleDraft
    : String(gradient?.angle ?? 90)

  const updateGradientAngle = (candidate: string) => {
    if (!gradient) return
    const angle = Number(candidate)
    if (candidate.trim() === '' || !isEditorGradientAngle(angle)) return
    onChange({ ...gradient, angle })
  }

  const commitAngle = () => {
    if (!gradient) return
    const angle = Number(angleDraft)
    if (!isEditorGradientAngle(angle) || angleDraft.trim() === '') {
      setAngleDraft(String(gradient.angle))
      setEditingAngle(false)
      return
    }
    onChange({ ...gradient, angle })
    setAngleDraft(String(angle))
    setEditingAngle(false)
  }

  const handleAngleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setAngleDraft(String(gradient?.angle ?? 90))
      setEditingAngle(false)
      event.currentTarget.blur()
    }
  }

  return (
    <div className="background-fill-control" aria-label={label}>
      <div className="background-fill-control__heading">
        <span>{label}</span>
        <div className="background-fill-control__mode" role="group" aria-label={`${label} type`}>
          <button
            type="button"
            aria-pressed={fill.type === 'solid'}
            disabled={disabled}
            onClick={() => onChange(toSolidFill(fill))}
          >
            Helfarge
          </button>
          <button
            type="button"
            aria-pressed={fill.type === 'linear-gradient'}
            disabled={disabled}
            onClick={() => onChange(toLinearGradientFill(fill))}
          >
            Gradient
          </button>
        </div>
      </div>

      <div
        className="background-fill-control__preview"
        style={{ background: editorFillToCssBackground(fill) }}
        aria-label={`${label} forhåndsvisning`}
      />

      {fill.type === 'solid' ? (
        <ColorSwatchInput
          id={`${id}-solid`}
          label={`${label} farge`}
          value={fill.color}
          disabled={disabled}
          onChange={(color) => onChange({ type: 'solid', color: color as typeof fill.color })}
        />
      ) : (
        <div className="background-fill-control__gradient-fields">
          <ColorSwatchInput
            id={`${id}-stop-1`}
            label={`${label} farge 1`}
            value={fill.stops[0]}
            disabled={disabled}
            onChange={(color) =>
              onChange({ ...fill, stops: [color as typeof fill.stops[0], fill.stops[1]] })
            }
          />
          <ColorSwatchInput
            id={`${id}-stop-2`}
            label={`${label} farge 2`}
            value={fill.stops[1]}
            disabled={disabled}
            onChange={(color) =>
              onChange({ ...fill, stops: [fill.stops[0], color as typeof fill.stops[1]] })
            }
          />
          <div className="background-fill-control__angle">
            <label htmlFor={`${id}-angle`}>Vinkel</label>
            <div className="background-fill-control__angle-inputs">
              <input
                id={`${id}-angle`}
                type="number"
                min={0}
                max={360}
                step={1}
                value={displayedAngle}
                disabled={disabled}
                aria-label={`${label} vinkel`}
                aria-invalid={
                  displayedAngle.trim() === '' ||
                  !isEditorGradientAngle(Number(displayedAngle))
                }
                onFocus={() => {
                  setAngleDraft(String(fill.angle))
                  setEditingAngle(true)
                }}
                onChange={(event) => {
                  setAngleDraft(event.target.value)
                  updateGradientAngle(event.target.value)
                }}
                onBlur={commitAngle}
                onKeyDown={handleAngleKeyDown}
              />
              <span>°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={fill.angle}
              disabled={disabled}
              aria-label={`${label} vinkel skyveknapp`}
              onChange={(event) =>
                onChange({ ...fill, angle: Number(event.target.value) })
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}
