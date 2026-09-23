import { useId, useState, type FormEvent } from 'react'
import type { HeaderEditorElement } from '../../model/editorProject'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
  MAX_HEADER_SITE_NAME_LENGTH,
  MAX_HEADER_SUBTITLE_LENGTH,
  normalizeHeaderText,
} from '../../model/headerElement'
import { useHeaderProperties } from '../../state/useHeaderProperties'
import { HeaderLogoProperties } from './HeaderLogoProperties'

export function HeaderPropertiesSection({
  element,
}: {
  element: HeaderEditorElement
}) {
  const idPrefix = useId()
  const [siteName, setSiteName] = useState(element.siteName)
  const [subtitle, setSubtitle] = useState(element.subtitle)
  const [message, setMessage] = useState<string | null>(null)
  const { updateHeaderContent } = useHeaderProperties()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextSiteName = normalizeHeaderText(siteName)
    const nextSubtitle = normalizeHeaderText(subtitle)

    if (
      !isValidHeaderSiteName(nextSiteName) ||
      !isValidHeaderSubtitle(nextSubtitle)
    ) {
      setMessage('Kontroller Header-teksten og prøv igjen.')
      return
    }

    setSiteName(nextSiteName)
    setSubtitle(nextSubtitle)
    updateHeaderContent(element.id, nextSiteName, nextSubtitle)
    setMessage('Header-innholdet er lagret.')
  }

  return (
    <section className="hero-properties" aria-labelledby={idPrefix + '-heading'}>
      <h3 id={idPrefix + '-heading'}>Header-innhold</h3>

      <form className="hero-properties__form" onSubmit={handleSubmit}>
        <label className="hero-properties__field" htmlFor={idPrefix + '-name'}>
          <span>Navn på nettsted eller firma</span>
          <input
            id={idPrefix + '-name'}
            value={siteName}
            maxLength={MAX_HEADER_SITE_NAME_LENGTH}
            disabled={element.locked}
            onChange={(event) => {
              setSiteName(event.currentTarget.value)
              setMessage(null)
            }}
          />
        </label>

        <label
          className="hero-properties__field"
          htmlFor={idPrefix + '-subtitle'}
        >
          <span>Undertittel</span>
          <input
            id={idPrefix + '-subtitle'}
            value={subtitle}
            maxLength={MAX_HEADER_SUBTITLE_LENGTH}
            disabled={element.locked}
            onChange={(event) => {
              setSubtitle(event.currentTarget.value)
              setMessage(null)
            }}
          />
        </label>

        <button
          className="hero-properties__primary"
          type="submit"
          disabled={element.locked}
        >
          Lagre Header-tekst
        </button>
      </form>

      <HeaderLogoProperties element={element} />

      {message && (
        <p className="hero-properties__message" role="status">
          {message}
        </p>
      )}

      {element.locked && (
        <p className="hero-properties__locked-note">
          Lås opp Header-elementet for å redigere innholdet.
        </p>
      )}
    </section>
  )
}
