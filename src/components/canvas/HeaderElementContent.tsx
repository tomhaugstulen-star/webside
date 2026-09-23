import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { HeaderEditorElement } from '../../model/editorProject'
import type { NavigationTarget } from '../../model/navigation'
import { resolveNavigationTargetHref } from '../../model/navigationHref'
import { useEditorProject } from '../../state/useEditorProject'

type HeaderNavigationContext = {
  pages: readonly { id: string; slug: string; elements: Array<{ id: string; kind: string; anchorId?: unknown }> }[]
  navigation: { items: Array<{ id: string; label: string; target: NavigationTarget; parentId?: string }> }
  activePageId: string
}

type HeaderElementContentProps = {
  element: HeaderEditorElement
  onNavigate: (target: NavigationTarget) => void
  navigationContext?: HeaderNavigationContext
}

export function HeaderElementContent({
  element,
  onNavigate,
  navigationContext,
}: HeaderElementContentProps) {
  const { getImageAsset } = useImageAssetStore()
  const { state } = useEditorProject()
  const resource = getImageAsset(element.logoAssetId)
  const pages = navigationContext?.pages ?? pages
  const navigation = navigationContext?.navigation ?? state.project.navigation
  const activePageId = navigationContext?.activePageId ?? activePageId
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigationRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const closeOutside = (event: globalThis.PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null)
        setMobileMenuOpen(false)
      }
    }
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null)
        setMobileMenuOpen(false)
      }
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

      {navigation.items.length > 0 && (
        <>
        <button
          type="button"
          className="header-element__mobile-menu-toggle"
          aria-label={mobileMenuOpen ? 'Lukk meny' : 'Åpne meny'}
          aria-expanded={mobileMenuOpen}
          onPointerDown={stopHeaderSelection}
          onClick={(event) => {
            event.stopPropagation()
            setMobileMenuOpen((open) => !open)
            setOpenMenuId(null)
          }}
        >
          Meny
        </button>
        <nav
          ref={navigationRef}
          className={`header-element__navigation${mobileMenuOpen ? ' header-element__navigation--mobile-open' : ''}`}
          aria-label="Nettstedmeny"
        >
          {navigation.items.filter((item) => !item.parentId).map((item) => {
            const href = resolveNavigationTargetHref(
              pages,
              item.target,
            )

            if (!href) {
              return null
            }

            const currentPage =
              item.target.type === 'page' &&
              item.target.pageId === activePageId
            const children = navigation.items.filter(
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
                  setMobileMenuOpen(false)
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
                      const childHref = resolveNavigationTargetHref(pages, child.target)
                      return childHref && <button key={child.id} type="button"
                        className="header-element__navigation-item"
                        data-public-href={childHref}
                        onPointerDown={stopHeaderSelection}
                        onClick={(event) => {
                          event.stopPropagation()
                          setOpenMenuId(null)
                          setMobileMenuOpen(false)
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
        </>
      )}
    </div>
  )
}
