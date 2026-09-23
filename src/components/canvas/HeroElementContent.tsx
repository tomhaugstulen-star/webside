import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { HeroEditorElement } from '../../model/editorProject'

export function HeroElementContent({
  element,
}: {
  element: HeroEditorElement
}) {
  const { getImageAsset } = useImageAssetStore()
  const resource = getImageAsset(element.imageAssetId)

  return (
    <div className="hero-element__content" aria-hidden="true">
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
        <span className="hero-element__cta">{element.ctaLabel}</span>
      </div>
    </div>
  )
}
