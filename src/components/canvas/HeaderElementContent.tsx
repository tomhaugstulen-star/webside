import type { PointerEvent } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { HeaderEditorElement } from '../../model/editorProject'
import type { NavigationTarget } from '../../model/navigation'
import { resolveNavigationTargetHref } from '../../model/navigationHref'
import { useEditorProject } from '../../state/useEditorProject'

type HeaderElementContentProps = {
  element: HeaderEditorElement
  onNavigate: (target: NavigationTarget) => void
}

export function HeaderElementContent({
  element,
  onNavigate,
}: HeaderElementContentProps) {
  const { getImageAsset } = useImageAssetStore()
  const { state } = useEditorProject()
  const resource = getImageAsset(element.logoAssetId)

  const stopHeaderSelection = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <div className="header-element__content">
      <div className="header-element__brand" aria-hidden="true">
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

      {state.project.navigation.items.length > 0 && (
        <nav className="header-element__navigation" aria-label="Nettstedmeny">
          {state.project.navigation.items.map((item) => {
            const href = resolveNavigationTargetHref(
              state.project.pages,
              item.target,
            )

            if (!href) {
              return null
            }

            const currentPage =
              item.target.type === 'page' &&
              item.target.pageId === state.activePageId

            return (
              <button
                key={item.id}
                type="button"
                className="header-element__navigation-item"
                data-public-href={href}
                aria-current={currentPage ? 'page' : undefined}
                onPointerDown={stopHeaderSelection}
                onClick={(event) => {
                  event.stopPropagation()
                  onNavigate(item.target)
                }}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}
