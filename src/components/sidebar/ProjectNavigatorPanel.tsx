import { useState } from 'react'
import { useEditorProject } from '../../state/useEditorProject'
import {
  getNavigatorElementName,
  getNavigatorVisibilityLabel,
  matchesNavigatorFilters,
  navigatorKindLabels,
  type NavigatorKindFilter,
  type NavigatorStatusFilter,
} from '../navigation/editorNavigationItems'
import { PageManagementSection } from './PageManagementSection'
import { WebsiteNavigationSection } from './WebsiteNavigationSection'

export function ProjectNavigatorPanel() {
  const { state, dispatch } = useEditorProject()
  const [kindFilter, setKindFilter] = useState<NavigatorKindFilter>('all')
  const [statusFilter, setStatusFilter] =
    useState<NavigatorStatusFilter>('all')

  const selectPage = (pageId: string) => {
    dispatch({ type: 'set-active-page', pageId })
  }

  const selectElement = (pageId: string, elementId: string) => {
    if (state.activePageId !== pageId) {
      dispatch({ type: 'set-active-page', pageId })
    }

    dispatch({ type: 'set-selected-element', elementId })
  }

  return (
    <>
      <h2>Prosjekt</h2>
      <div className="project-navigator__summary">
        <strong>{state.project.name}</strong>
        <span>
          {state.project.pages.length}{' '}
          {state.project.pages.length === 1 ? 'side' : 'sider'}
        </span>
      </div>

      <PageManagementSection />

      <div className="project-navigator__filters">
        <label>
          <span>Elementtype</span>
          <select
            value={kindFilter}
            onChange={(event) =>
              setKindFilter(event.target.value as NavigatorKindFilter)
            }
          >
            <option value="all">Alle</option>
            <option value="section">Seksjon</option>
            <option value="image">Bilde</option>
            <option value="text">Tekst</option>
            <option value="button">Knapp</option>
            <option value="header">Header</option>
          </select>
        </label>

        <label>
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as NavigatorStatusFilter)
            }
          >
            <option value="all">Alle</option>
            <option value="visible">Synlige</option>
            <option value="hidden">Skjulte</option>
            <option value="locked">Låste</option>
            <option value="unlocked">Ulåste</option>
          </select>
        </label>
      </div>

      <nav className="project-navigator" aria-label="Prosjektnavigator">
        {state.project.pages.map((page) => {
          const activePage = page.id === state.activePageId
          const matchingElements = page.elements
            .map((element, elementIndex) => ({ element, elementIndex }))
            .filter(({ element }) =>
              matchesNavigatorFilters(element, kindFilter, statusFilter),
            )

          return (
            <section className="project-navigator__page" key={page.id}>
              <button
                className={`project-navigator__page-button${
                  activePage ? ' project-navigator__page-button--active' : ''
                }`}
                type="button"
                aria-current={activePage ? 'page' : undefined}
                onClick={() => selectPage(page.id)}
              >
                <span>{page.name}</span>
                <small>{page.slug}</small>
              </button>

              {matchingElements.length > 0 ? (
                <ul className="project-navigator__elements">
                  {matchingElements.map(({ element, elementIndex }) => {
                    const selected =
                      activePage && element.id === state.selectedElementId
                    const name = getNavigatorElementName(
                      page,
                      element,
                      elementIndex,
                    )

                    return (
                      <li key={element.id}>
                        <button
                          className={`project-navigator__element${
                            selected
                              ? ' project-navigator__element--selected'
                              : ''
                          }`}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => selectElement(page.id, element.id)}
                        >
                          <span className="project-navigator__element-main">
                            <strong>{name}</strong>
                            <small>{navigatorKindLabels[element.kind]}</small>
                          </span>
                          <span className="project-navigator__element-status">
                            <small>
                              {getNavigatorVisibilityLabel(element)}
                            </small>
                            {element.locked && <small>Låst</small>}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="project-navigator__empty">
                  Ingen elementer matcher filteret
                </p>
              )}
            </section>
          )
        })}
      </nav>

      <WebsiteNavigationSection />
    </>
  )
}
