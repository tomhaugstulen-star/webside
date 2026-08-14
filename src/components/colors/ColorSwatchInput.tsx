import { useEffect, useState, type KeyboardEvent } from 'react'
import {
  normalizeEditorColor,
  type EditorColor,
} from '../../model/editorColor'

type EyeDropperResult = {
  sRGBHex: string
}

type EyeDropperInstance = {
  open: () => Promise<EyeDropperResult>
}

type EyeDropperConstructor = new () => EyeDropperInstance

type WindowWithEyeDropper = Window & {
  EyeDropper?: EyeDropperConstructor
}

type ColorSwatchInputProps = {
  id: string
  label: string
  value: EditorColor
  disabled?: boolean
  onChange: (value: string) => void
}

function getEyeDropperConstructor() {
  if (typeof window === 'undefined') return null
  return (window as WindowWithEyeDropper).EyeDropper ?? null
}

export function ColorSwatchInput({
  id,
  label,
  value,
  disabled = false,
  onChange,
}: ColorSwatchInputProps) {
  const [draftValue, setDraftValue] = useState(value)
  const [picking, setPicking] = useState(false)
  const eyeDropperSupported = getEyeDropperConstructor() !== null
  const controlDisabled = disabled || picking

  useEffect(() => {
    setDraftValue(value)
  }, [value])

  const applyHexValue = (candidate: string) => {
    const normalized = normalizeEditorColor(candidate)

    if (!normalized) {
      setDraftValue(value)
      return
    }

    setDraftValue(normalized)
    onChange(normalized)
  }

  const handleHexChange = (nextValue: string) => {
    const uppercaseValue = nextValue.toUpperCase()
    setDraftValue(uppercaseValue)

    const normalized = normalizeEditorColor(uppercaseValue)
    if (normalized) onChange(normalized)
  }

  const handleHexKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
      return
    }

    if (event.key === 'Escape') {
      setDraftValue(value)
      event.currentTarget.blur()
    }
  }

  const pickColor = async () => {
    const EyeDropper = getEyeDropperConstructor()
    if (!EyeDropper || controlDisabled) return

    setPicking(true)
    try {
      const result = await new EyeDropper().open()
      applyHexValue(result.sRGBHex)
    } catch {
      // Avbrutt pipettevalg skal ikke endre eksisterende farge.
    } finally {
      setPicking(false)
    }
  }

  return (
    <div className="color-swatch-input">
      <span>{label}</span>
      <span className="color-swatch-input__control">
        <input
          id={id}
          type="color"
          value={value}
          disabled={controlDisabled}
          aria-label={`${label}. Nåværende farge ${value}`}
          onChange={(event) => applyHexValue(event.target.value)}
        />
        <input
          className="color-swatch-input__hex"
          type="text"
          value={draftValue}
          disabled={controlDisabled}
          maxLength={7}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          aria-label={`${label} HEX-kode`}
          aria-invalid={normalizeEditorColor(draftValue) === null}
          onChange={(event) => handleHexChange(event.target.value)}
          onBlur={() => applyHexValue(draftValue)}
          onKeyDown={handleHexKeyDown}
        />
        <button
          className="color-swatch-input__eyedropper"
          type="button"
          disabled={controlDisabled || !eyeDropperSupported}
          title={
            eyeDropperSupported
              ? `Hent ${label.toLowerCase()} fra skjermen`
              : 'Pipette støttes ikke av denne nettleseren'
          }
          aria-label={`Pipette for ${label.toLowerCase()}`}
          onClick={pickColor}
        >
          Pipette
        </button>
      </span>
    </div>
  )
}
