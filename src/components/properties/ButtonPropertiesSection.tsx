import { useId, useState, type FormEvent } from 'react'
import {
  buttonAssetCatalog,
  findButtonAsset,
} from '../../assets/buttons/buttonAssetCatalog'
import { normalizeButtonLabel } from '../../model/buttonAsset'
import type { ButtonEditorElement } from '../../model/editorProject'
import { useButtonProperties } from '../../state/useButtonProperties'

type ButtonPropertiesSectionProps = {
  element: ButtonEditorElement
}

export function ButtonPropertiesSection({
  element,
}: ButtonPropertiesSectionProps) {
  const { updateButtonLabel, updateButtonAsset } = useButtonProperties()
  const [labelDraft, setLabelDraft] = useState(element.label)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const currentAsset = findButtonAsset(element.assetId)
  const idPrefix = useId()
  const titleId = `${idPrefix}-title`
  const labelId = `${idPrefix}-label`
  const labelErrorId = `${idPrefix}-label-error`
  const designId = `${idPrefix}-design`
  const disabled = element.locked

  const handleLabelSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedLabel = normalizeButtonLabel(labelDraft)

    if (!normalizedLabel) {
      setValidationMessage('Knappeteksten kan ikke være tom.')
      setSavedMessage(null)
      return
    }

    setLabelDraft(normalizedLabel)
    setValidationMessage(null)

    if (normalizedLabel === element.label) {
      setSavedMessage(null)
      return
    }

    updateButtonLabel(element.id, normalizedLabel)
    setSavedMessage('Knappeteksten er lagret.')
  }

  return (
    <section className="button-properties" aria-labelledby={titleId}>
      <h3 id={titleId}>Knapp</h3>

      <form className="button-properties__form" onSubmit={handleLabelSubmit}>
        <label className="button-properties__field" htmlFor={labelId}>
          <span>Tekst</span>
          <input
            id={labelId}
            type="text"
            value={labelDraft}
            disabled={disabled}
            aria-invalid={validationMessage !== null}
            aria-describedby={validationMessage ? labelErrorId : undefined}
            onChange={(event) => {
              setLabelDraft(event.target.value)
              setValidationMessage(null)
              setSavedMessage(null)
            }}
          />
        </label>

        {validationMessage && (
          <p
            id={labelErrorId}
            className="button-properties__error"
            role="alert"
          >
            {validationMessage}
          </p>
        )}

        <button
          className="button-properties__submit"
          type="submit"
          disabled={disabled}
        >
          Lagre tekst
        </button>

        {savedMessage && (
          <p className="button-properties__saved" role="status">
            {savedMessage}
          </p>
        )}
      </form>

      <label className="button-properties__field" htmlFor={designId}>
        <span>Design</span>
        <select
          id={designId}
          value={currentAsset?.id ?? ''}
          disabled={disabled}
          onChange={(event) => {
            const nextAsset = buttonAssetCatalog.find(
              (asset) => asset.id === event.target.value,
            )

            if (nextAsset) {
              updateButtonAsset(element.id, nextAsset.id)
            }
          }}
        >
          {!currentAsset && (
            <option value="" disabled>
              Ukjent design
            </option>
          )}
          {buttonAssetCatalog.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>
      </label>

      {currentAsset ? (
        <p className="button-properties__help">
          Valgt design: {currentAsset.name}
        </p>
      ) : (
        <p className="button-properties__warning" role="alert">
          Det lagrede knappdesignet finnes ikke i biblioteket. Velg et nytt
          design for å reparere knappen.
        </p>
      )}

      {disabled && (
        <p className="button-properties__locked-note">
          Lås opp knappen for å endre tekst og design.
        </p>
      )}
    </section>
  )
}
