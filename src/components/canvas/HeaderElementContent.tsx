import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { HeaderEditorElement } from '../../model/editorProject'

type HeaderElementContentProps = {
  element: HeaderEditorElement
}

export function HeaderElementContent({
  element,
}: HeaderElementContentProps) {
  const { getImageAsset } = useImageAssetStore()
  const resource = getImageAsset(element.logoAssetId)

  return (
    <div className="header-element__content" aria-hidden="true">
      <div className="header-element__logo-frame">
        {resource ? (
          <img
            className="header-element__logo"
            src={resource.objectUrl}
            alt=""
            draggable={false}
          />
        ) : (
          <span className="header-element__logo-fallback">Logo mangler</span>
        )}
      </div>
      <div className="header-element__text">
        <strong className="header-element__site-name">
          {element.siteName}
        </strong>
        {element.subtitle && (
          <span className="header-element__subtitle">
            {element.subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
