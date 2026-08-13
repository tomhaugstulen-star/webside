import { useState, type FormEvent } from 'react'
import type { EditorPage } from '../../model/editorProject'
import {
  createUniquePageSlug,
  isValidPageName,
  normalizePageName,
  normalizePageSlug,
} from '../../model/siteStructure'
import { useEditorProject } from '../../state/useEditorProject'
import { usePageActions } from '../../state/usePageActions'

type ActivePageSettingsProps = {
  page: EditorPage
  pages: readonly EditorPage[]
  pageIndex: number
  onSetName: (pageId: string, name: string) => void
  onSetSlug: (pageId: string, slug: string) => void
  onMove: (pageId: string, direction: 'up' | 'down') => void
  onDelete: (pageId: string) => void
}

function ActivePageSettings({
  page,
  pages,
  pageIndex,
  onSetName,
  onSetSlug,
  onMove,
  onDelete,
}: ActivePageSettingsProps) {
  const [nameDraft, setNameDraft] = useState(page.name)
  const [slugDraft, setSlugDraft] = useState(page.slug)
  const [feedback, setFeedback] = useState('')

  const saveName = (event: FormEvent) => {
    event.preventDefault()
    const normalized = normalizePageName(nameDraft)

    if (!isValidPageName(normalized)) {
      setFeedback('Siden må ha et navn på maks 80 tegn.')
      return
    }

    setNameDraft(normalized)
    onSetName(page.id, normalized)
    setFeedback(normalized === page.name ? 'Navnet er uendret.' : 'Sidenavnet er lagret.')
  }

  const saveSlug = (event: FormEvent) => {
    event.preventDefault()
    const normalized = normalizePageSlug(slugDraft)

    if (!normalized) {
      setFeedback('Sideadressen må inneholde minst ett gyldig tegn.')
      return
    }

    const duplicate = pages.some(
      (candidate) => candidate.id !== page.id && candidate.slug === normalized,
    )

    if (duplicate) {
      setFeedback('Denne sideadressen er allerede i bruk.')
      return
    }

    setSlugDraft(normalized)
    onSetSlug(page.id, normalized)
    setFeedback(
      normalized === page.slug
        ? 'Sideadressen er uendret.'
        : 'Sideadressen er lagret.',
    )
  }

  const removePage = () => {
    if (pages.length <= 1) {
      return
    }

    const confirmed = window.confirm(
      `Slette siden «${page.name}» og alle elementene på siden?\n\nDette kan ikke angres.`,
    )

    if (confirmed) {
      onDelete(page.id)
    }
  }

  return (
    <>
      <p className="site-structure__hint">
        Rediger siden som er markert i prosjektnavigatoren.
      </p>

      <form className="site-structure__form" onSubmit={saveName}>
        <label>
          <span>Navn</span>
          <input
            value={nameDraft}
            maxLength={80}
            onChange={(event) => setNameDraft(event.target.value)}
          />
        </label>
        <button type="submit">Lagre navn</button>
      </form>

      <form className="site-structure__form" onSubmit={saveSlug}>
        <label>
          <span>Sideadresse</span>
          <input
            value={slugDraft}
            maxLength={100}
            spellCheck={false}
            onChange={(event) => setSlugDraft(event.target.value)}
          />
        </label>
        <button type="submit">Lagre adresse</button>
      </form>

      <div className="site-structure__button-row" aria-label="Siderekkefølge">
        <button
          type="button"
          disabled={pageIndex <= 0}
          onClick={() => onMove(page.id, 'up')}
        >
          Flytt opp
        </button>
        <button
          type="button"
          disabled={pageIndex >= pages.length - 1}
          onClick={() => onMove(page.id, 'down')}
        >
          Flytt ned
        </button>
      </div>

      <button
        className="site-structure__danger-button"
        type="button"
        disabled={pages.length <= 1}
        onClick={removePage}
      >
        Slett side
      </button>

      <p className="site-structure__feedback" aria-live="polite">
        {feedback}
      </p>
    </>
  )
}

export function PageManagementSection() {
  const { state } = useEditorProject()
  const { addPage, setPageName, setPageSlug, movePage, deletePage } =
    usePageActions()
  const activePage = state.project.pages.find(
    (page) => page.id === state.activePageId,
  )

  if (!activePage) {
    return null
  }

  const pageIndex = state.project.pages.findIndex(
    (page) => page.id === activePage.id,
  )

  const createPage = () => {
    const name = `Side ${state.project.pages.length + 1}`
    const slug = createUniquePageSlug(
      state.project.pages.map((page) => page.slug),
      name,
    )

    addPage(name, slug)
  }

  return (
    <section className="page-management" aria-labelledby="page-management-title">
      <div className="site-structure__section-heading">
        <h3 id="page-management-title">Sider</h3>
        <button type="button" onClick={createPage}>
          + Ny side
        </button>
      </div>

      <ActivePageSettings
        key={activePage.id}
        page={activePage}
        pages={state.project.pages}
        pageIndex={pageIndex}
        onSetName={setPageName}
        onSetSlug={setPageSlug}
        onMove={movePage}
        onDelete={deletePage}
      />
    </section>
  )
}
