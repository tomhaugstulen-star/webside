import { useEffect, useRef, useState, type PointerEvent } from 'react'
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const navigationRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const closeOutside = (event: globalThis.PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) setOpenMenuId(null)
    }
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenuId(null)
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeEscape)
    }
  }, [])

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
        <nav ref={navigationRef} className="header-element__navigation" aria-label="Nettstedmeny">
          {state.project.navigation.items.filter((item) => !item.parentId).map((item) => {
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
            const children = state.project.navigation.items.filter(
              (child) => child.parentId === item.id,
            )

            return (
              <div className="header-element__navigation-group" key={item.id}>
              <button
                type="button"
                className="header-element__navigation-item"
                data-public-href={href}
                aria-current={currentPage ? 'page' : undefined}
                onPointerDown={stopHeaderSelection}
                onClick={(event) => {
                  event.stopPropagation()
                  setOpenMenuId(null)
                  onNavigate(item.target)
                }}
              >
                {item.label}
              </button>
              {children.length > 0 && <>
                <button type="button" className="header-element__navigation-expand"
                  aria-label={`Vis undermeny for ${item.label}`}
                  aria-expanded={openMenuId === item.id}
                  onPointerDown={stopHeaderSelection}
                  onClick={(event) => {
                    event.stopPropagation()
                    setOpenMenuId(openMenuId === item.id ? null : item.id)
                  }}>▾</button>
                {openMenuId === item.id && (
                  <div className="header-element__submenu" aria-label={`Undermeny for ${item.label}`}>
                    {children.map((child) => {
                      const childHref = resolveNavigationTargetHref(state.project.pages, child.target)
                      return childHref && <button key={child.id} type="button"
                        className="header-element__navigation-item"
                        data-public-href={childHref}
                        onPointerDown={stopHeaderSelection}
                        onClick={(event) => {
                          event.stopPropagation()
                          setOpenMenuId(null)
                          onNavigate(child.target)
                        }}>{child.label}</button>
                    })}
                  </div>
                )}
              </>}
              </div>
            )
          })}
        </nav>
      )}
    </div>
  )
}
