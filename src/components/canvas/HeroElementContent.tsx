import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { HeroEditorElement } from '../../model/editorProject'

export function HeroElementContent({
  element,
  previewLinks = false,
}: {
  element: HeroEditorElement
  previewLinks?: boolean
}) {
  const { getImageAsset } = useImageAssetStore()
  const resource = getImageAsset(element.imageAssetId)
  const cta =
    previewLinks && element.ctaLink.type === 'external-url' ? (
      <a
        className="hero-element__cta"
        href={element.ctaLink.url}
        target={element.ctaLink.openInNewTab ? '_blank' : undefined}
        rel={element.ctaLink.openInNewTab ? 'noreferrer' : undefined}
      >
        {element.ctaLabel}
      </a>
    ) : (
      <span className="hero-element__cta">{element.ctaLabel}</span>
    )

  return (
    <div className="hero-element__content" aria-hidden={!previewLinks}>
      {resource ? (
        <img
          className="hero-element__image"
          src={resource.objectUrl}
          alt=""
          draggable={false}
        />
      ) : (
        <span className="hero-element__fallback">Hero-bildet mangler</span>
      )}

      <div className="hero-element__copy">
        {element.title && (
          <strong className="hero-element__title">{element.title}</strong>
        )}
        {element.subtitle && (
          <span className="hero-element__subtitle">{element.subtitle}</span>
        )}
        {element.ctaLabel && cta}
      </div>
    </div>
  )
}
