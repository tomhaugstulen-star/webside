import { useId, useState, type FormEvent } from 'react'
import type { TextEditorElement } from '../../model/editorProject'
import {
  NO_ELEMENT_LINK,
  normalizeExternalUrl,
  type ElementLink,
} from '../../model/elementLink'
import { useTextElementLink } from '../../state/useTextElementLink'

const invalidUrlMessage =
  'Skriv inn en fullstendig adresse som starter med http:// eller https://.'

type LinkType = ElementLink['type']

type LinkDraft = {
  type: LinkType
  url: string
  openInNewTab: boolean
}

function createDraft(link: ElementLink): LinkDraft {
  return link.type === 'none'
    ? { type: 'none', url: '', openInNewTab: false }
    : {
        type: 'external-url',
        url: link.url,
        openInNewTab: link.openInNewTab,
      }
}

function createFormKey(element: TextEditorElement) {
  return element.link.type === 'none'
    ? `${element.id}:none`
    : `${element.id}:external-url:${element.link.url}:${element.link.openInNewTab}`
}

type ElementLinkPropertiesSectionProps = {
  element: TextEditorElement
}

export function ElementLinkPropertiesSection({
  element,
}: ElementLinkPropertiesSectionProps) {
  return <ElementLinkForm key={createFormKey(element)} element={element} />
}

function ElementLinkForm({ element }: ElementLinkPropertiesSectionProps) {
  const { updateTextElementLink } = useTextElementLink()
  const initialDraft = createDraft(element.link)
  const [draftType, setDraftType] = useState<LinkType>(initialDraft.type)
  const [urlDraft, setUrlDraft] = useState(initialDraft.url)
  const [openInNewTab, setOpenInNewTab] = useState(initialDraft.openInNewTab)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const idPrefix = useId()
  const titleId = `${idPrefix}-title`
  const typeId = `${idPrefix}-type`
  const urlId = `${idPrefix}-url`
  const helpId = `${idPrefix}-help`
  const errorId = `${idPrefix}-error`
  const disabled = element.locked
  const hasPendingChanges =
    draftType !== element.link.type ||
    (draftType === 'external-url' &&
      element.link.type === 'external-url' &&
      (urlDraft.trim() !== element.link.url ||
        openInNewTab !== element.link.openInNewTab))
  const linkSaved = element.link.type === 'external-url' && !hasPendingChanges

  const submitLabel =
    draftType === 'none'
      ? element.link.type === 'none'
        ? 'Ingen lenke'
        : 'Fjern lenke'
      : element.link.type === 'none'
        ? 'Lag lenke'
        : linkSaved
          ? 'Lenke lagret'
          : 'Lagre lenke'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (draftType === 'none') {
      setValidationMessage(null)
      updateTextElementLink(element.id, { ...NO_ELEMENT_LINK })
      return
    }

    const normalizedUrl = normalizeExternalUrl(urlDraft)

    if (!normalizedUrl) {
      setValidationMessage(invalidUrlMessage)
      return
    }

    setUrlDraft(normalizedUrl)
    setValidationMessage(null)
    updateTextElementLink(element.id, {
      type: 'external-url',
      url: normalizedUrl,
      openInNewTab,
    })
  }

  return (
    <section className="element-link-properties" aria-labelledby={titleId}>
      <h3 id={titleId}>Lenke</h3>

      <form
        className="element-link-properties__form"
        noValidate
        onSubmit={handleSubmit}
      >
        <label className="element-link-properties__field" htmlFor={typeId}>
          <span>Type</span>
          <select
            id={typeId}
            value={draftType}
            disabled={disabled}
            onChange={(event) => {
              setDraftType(event.target.value as LinkType)
              setValidationMessage(null)
            }}
          >
            <option value="none">Ingen</option>
            <option value="external-url">Ekstern lenke</option>
          </select>
        </label>

        {draftType === 'external-url' && (
          <>
            <label className="element-link-properties__field" htmlFor={urlId}>
              <span>Nettadresse</span>
              <input
                id={urlId}
                type="url"
                inputMode="url"
                autoCapitalize="none"
                autoComplete="url"
                spellCheck={false}
                value={urlDraft}
                placeholder="https://eksempel.no"
                disabled={disabled}
                aria-invalid={validationMessage !== null}
                aria-describedby={
                  validationMessage ? `${helpId} ${errorId}` : helpId
                }
                onChange={(event) => {
                  setUrlDraft(event.target.value)
                  setValidationMessage(null)
                }}
              />
            </label>

            <label className="element-link-properties__checkbox">
              <input
                type="checkbox"
                checked={openInNewTab}
                disabled={disabled}
                onChange={(event) => {
                  setOpenInNewTab(event.target.checked)
                  setValidationMessage(null)
                }}
              />
              <span>Åpne i ny fane</span>
            </label>
          </>
        )}

        <p id={helpId} className="element-link-properties__help">
          Lenken åpnes ikke mens du redigerer nettsiden.
        </p>

        {validationMessage && (
          <p
            id={errorId}
            className="element-link-properties__error"
            role="alert"
          >
            {validationMessage}
          </p>
        )}

        <button
          className={`element-link-properties__submit ${linkSaved ? 'element-link-properties__submit--saved' : ''}`}
          type="submit"
          disabled={disabled}
        >
          {submitLabel}
        </button>

        {linkSaved && (
          <p className="element-link-properties__saved" role="status">
            Lenken er lagret på tekstboksen.
          </p>
        )}
      </form>

      {disabled && (
        <p className="element-link-properties__locked-note">
          Lås opp elementet for å endre lenken.
        </p>
      )}
    </section>
  )
}
