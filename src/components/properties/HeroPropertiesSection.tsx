import { useId, useState, type FormEvent } from 'react'
import type { HeroEditorElement } from '../../model/editorProject'
import {
  isValidHeroCtaLabel,
  isValidHeroSubtitle,
  isValidHeroTitle,
  MAX_HERO_CTA_LABEL_LENGTH,
  MAX_HERO_SUBTITLE_LENGTH,
  MAX_HERO_TITLE_LENGTH,
  normalizeHeroText,
} from '../../model/heroElement'
import { useHeroProperties } from '../../state/useHeroProperties'
import { BackgroundFillControl } from '../colors/BackgroundFillControl'
import { ColorSwatchInput } from '../colors/ColorSwatchInput'
import { HeroImageProperties } from './HeroImageProperties'

export function HeroPropertiesSection({
  element,
}: {
  element: HeroEditorElement
}) {
  const idPrefix = useId()
  const [title, setTitle] = useState(element.title)
  const [subtitle, setSubtitle] = useState(element.subtitle)
  const [ctaLabel, setCtaLabel] = useState(element.ctaLabel)
  const [message, setMessage] = useState<string | null>(null)
  const {
    updateHeroContent,
    updateHeroBackgroundFill,
    updateHeroTextColor,
  } = useHeroProperties()
  const disabled = element.locked

  const handleContentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextTitle = normalizeHeroText(title)
    const nextSubtitle = normalizeHeroText(subtitle)
    const nextCtaLabel = normalizeHeroText(ctaLabel)

    if (
      !isValidHeroTitle(nextTitle) ||
      !isValidHeroSubtitle(nextSubtitle) ||
      !isValidHeroCtaLabel(nextCtaLabel)
    ) {
      setMessage('Kontroller Hero-tekstene og prøv igjen.')
      return
    }

    setTitle(nextTitle)
    setSubtitle(nextSubtitle)
    setCtaLabel(nextCtaLabel)
    updateHeroContent(element.id, nextTitle, nextSubtitle, nextCtaLabel)
    setMessage('Hero-innholdet er lagret.')
  }

  const titleId = idPrefix + '-title'
  const subtitleId = idPrefix + '-subtitle'
  const ctaId = idPrefix + '-cta'

  return (
    <section className="hero-properties" aria-labelledby={idPrefix + '-heading'}>
      <h3 id={idPrefix + '-heading'}>Hero</h3>

      <form className="hero-properties__form" onSubmit={handleContentSubmit}>
        <label className="hero-properties__field" htmlFor={titleId}>
          <span>Overskrift</span>
          <input
            id={titleId}
            value={title}
            maxLength={MAX_HERO_TITLE_LENGTH}
            disabled={disabled}
            onChange={(event) => {
              setTitle(event.currentTarget.value)
              setMessage(null)
            }}
          />
        </label>

        <label className="hero-properties__field" htmlFor={subtitleId}>
          <span>Undertittel</span>
          <textarea
            id={subtitleId}
            rows={3}
            value={subtitle}
            maxLength={MAX_HERO_SUBTITLE_LENGTH}
            disabled={disabled}
            onChange={(event) => {
              setSubtitle(event.currentTarget.value)
              setMessage(null)
            }}
          />
        </label>

        <label className="hero-properties__field" htmlFor={ctaId}>
          <span>CTA-tekst</span>
          <input
            id={ctaId}
            value={ctaLabel}
            maxLength={MAX_HERO_CTA_LABEL_LENGTH}
            disabled={disabled}
            onChange={(event) => {
              setCtaLabel(event.currentTarget.value)
              setMessage(null)
            }}
          />
        </label>

        <button
          className="hero-properties__primary"
          type="submit"
          disabled={disabled}
        >
          Lagre Hero-tekst
        </button>
      </form>

      <div className="hero-properties__appearance">
        <BackgroundFillControl
          id={idPrefix + '-background'}
          label="Bakgrunn"
          fill={element.appearance.backgroundFill}
          disabled={disabled}
          onChange={(fill) => updateHeroBackgroundFill(element.id, fill)}
        />
        <ColorSwatchInput
          id={idPrefix + '-text-color'}
          label="Tekstfarge"
          value={element.appearance.textColor}
          disabled={disabled}
          onChange={(value) => updateHeroTextColor(element.id, value)}
        />
      </div>

      <HeroImageProperties element={element} disabled={disabled} />

      {message && (
        <p className="hero-properties__message" role="status">
          {message}
        </p>
      )}

      {disabled && (
        <p className="hero-properties__locked-note">
          Lås opp Hero-elementet for å redigere innhold og utseende.
        </p>
      )}
    </section>
  )
}
