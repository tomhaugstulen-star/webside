import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { prepareImageFile } from '../../assets/images/prepareImageFile'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
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
import {
  createImageAssetId,
  supportedImageMimeTypes,
  type ImageAssetId,
} from '../../model/imageAsset'
import { projectReferencesImageAsset } from '../../model/projectImageAssets'
import { useEditorProject } from '../../state/useEditorProject'
import { useHeroProperties } from '../../state/useHeroProperties'
import { BackgroundFillControl } from '../colors/BackgroundFillControl'
import { ColorSwatchInput } from '../colors/ColorSwatchInput'

export function HeroPropertiesSection({
  element,
}: {
  element: HeroEditorElement
}) {
  const idPrefix = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const [title, setTitle] = useState(element.title)
  const [subtitle, setSubtitle] = useState(element.subtitle)
  const [ctaLabel, setCtaLabel] = useState(element.ctaLabel)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { state } = useEditorProject()
  const {
    updateHeroContent,
    updateHeroImage,
    updateHeroBackgroundFill,
    updateHeroTextColor,
  } = useHeroProperties()
  const { registerImageAsset, removeImageAsset, getImageAsset } =
    useImageAssetStore()
  const disabled = element.locked || busy
  const resource = getImageAsset(element.imageAssetId)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

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

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''
    if (!file) return

    setBusy(true)
    setMessage(null)
    let registeredAssetId: ImageAssetId | null = null

    try {
      const prepared = await prepareImageFile(file)
      if (!mountedRef.current) return

      if (!prepared.ok) {
        setMessage(prepared.message)
        return
      }

      const assetId = createImageAssetId()
      if (
        !registerImageAsset(assetId, prepared.value.file, prepared.value.metadata)
      ) {
        setMessage('Det nye Hero-bildet kunne ikke registreres.')
        return
      }

      registeredAssetId = assetId
      const previousAssetId = element.imageAssetId
      const previousStillReferenced = projectReferencesImageAsset(
        state.project,
        previousAssetId,
        element.id,
      )

      updateHeroImage(element.id, assetId, prepared.value.metadata)
      registeredAssetId = null

      if (!previousStillReferenced) {
        removeImageAsset(previousAssetId)
      }

      setMessage('Hero-bildet er byttet.')
    } catch {
      if (registeredAssetId) removeImageAsset(registeredAssetId)
      if (mountedRef.current) {
        setMessage('Hero-bildet kunne ikke behandles. Prøv en annen fil.')
      }
    } finally {
      if (mountedRef.current) setBusy(false)
    }
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

      <div className="hero-properties__image">
        <input
          ref={fileInputRef}
          className="hero-properties__file-input"
          type="file"
          accept={supportedImageMimeTypes.join(',')}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleImageChange}
        />
        <button
          className="hero-properties__secondary"
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          {busy ? 'Leser bilde…' : 'Bytt Hero-bilde'}
        </button>
        <p className="hero-properties__file-name">
          {element.imageAssetMetadata.fileName}
        </p>
        {!resource && (
          <p className="hero-properties__warning" role="alert">
            Hero-bildet mangler i den aktive ressursbufferen.
          </p>
        )}
      </div>

      {message && (
        <p className="hero-properties__message" role="status">
          {message}
        </p>
      )}

      {element.locked && (
        <p className="hero-properties__locked-note">
          Lås opp Hero-elementet for å redigere innhold og utseende.
        </p>
      )}
    </section>
  )
}
