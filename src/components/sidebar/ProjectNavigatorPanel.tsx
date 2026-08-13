import type {
  EditorElement,
  EditorPage,
  ElementKind,
} from '../../model/editorProject'
import { useEditorProject } from '../../state/useEditorProject'

const kindLabels: Record<ElementKind, string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
  header: 'Header',
}

function getKindOrdinal(page: EditorPage, elementIndex: number) {
  const element = page.elements[elementIndex]

  return page.elements
    .slice(0, elementIndex + 1)
    .filter((candidate) => candidate.kind === element.kind).length
}

function getElementName(
  page: EditorPage,
  element: EditorElement,
  elementIndex: number,
) {
  switch (element.kind) {
    case 'text': {
      const content = element.content.trim().replace(/\s+/g, ' ')
      return content ? content.slice(0, 32) : 'Tom tekstboks'
    }
    case 'button':
      return element.label.trim() || 'Knapp'
    case 'image':
      return element.assetMetadata.fileName
    case 'header':
      return element.siteName.trim() || 'Header'
    case 'section':
      return `Seksjon ${getKindOrdinal(page, elementIndex)}`
  }
}

function getVisibilityLabel(element: EditorElement) {
  const desktopVisible = element.visibility.desktop
  const mobileVisible = element.visibility.mobile ?? desktopVisible

  if (!desktopVisible && !mobileVisible) {
    return 'Skjult'
  }

  if (desktopVisible && !mobileVisible) {
    return 'Skjult på telefon'
  }

  if (!desktopVisible && mobileVisible) {
    return 'Skjult på PC'
  }

  return 'Synlig'
}

export function ProjectNavigatorPanel() {
  const { state, dispatch } = useEditorProject()

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

      <nav className="project-navigator" aria-label="Prosjektnavigator">
        {state.project.pages.map((page) => {
          const activePage = page.id === state.activePageId

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

              {page.elements.length > 0 ? (
                <ul className="project-navigator__elements">
                  {page.elements.map((element, elementIndex) => {
                    const selected =
                      activePage && element.id === state.selectedElementId
                    const name = getElementName(page, element, elementIndex)

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
                            <small>{kindLabels[element.kind]}</small>
                          </span>
                          <span className="project-navigator__element-status">
                            <small>{getVisibilityLabel(element)}</small>
                            {element.locked && <small>Låst</small>}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="project-navigator__empty">Ingen elementer</p>
              )}
            </section>
          )
        })}
      </nav>
    </>
  )
}
