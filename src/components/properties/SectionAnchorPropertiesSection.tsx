import { useState, type FormEvent } from 'react'
import type { SectionEditorElement } from '../../model/editorProject'
import {
  isValidSectionAnchorId,
  normalizeSectionAnchorId,
} from '../../model/siteStructure'
import { useEditorProject } from '../../state/useEditorProject'
import { useSectionAnchorId } from '../../state/useSectionAnchorId'

type SectionAnchorPropertiesSectionProps = {
  element: SectionEditorElement
}

export function SectionAnchorPropertiesSection({
  element,
}: SectionAnchorPropertiesSectionProps) {
  const { state } = useEditorProject()
  const { setSectionAnchorId } = useSectionAnchorId()
  const [draft, setDraft] = useState(element.anchorId)
  const [feedback, setFeedback] = useState('')

  const saveAnchor = (event: FormEvent) => {
    event.preventDefault()
    const normalized = normalizeSectionAnchorId(draft)

    if (!normalized || !isValidSectionAnchorId(normalized)) {
      setFeedback('Seksjons-ID-en må inneholde minst ett gyldig tegn.')
      return
    }

    const activePage = state.project.pages.find(
      (page) => page.id === state.activePageId,
    )
    const duplicate = activePage?.elements.some(
      (candidate) =>
        candidate.kind === 'section' &&
        candidate.id !== element.id &&
        candidate.anchorId === normalized,
    )

    if (duplicate) {
      setFeedback('Denne seksjons-ID-en brukes allerede på siden.')
      return
    }

    setDraft(normalized)
    setSectionAnchorId(element.id, normalized)
    setFeedback(
      normalized === element.anchorId
        ? 'Seksjons-ID-en er uendret.'
        : 'Seksjons-ID-en er lagret.',
    )
  }

  return (
    <section
      className="section-anchor-properties"
      aria-labelledby="section-anchor-properties-title"
    >
      <h3 id="section-anchor-properties-title">Seksjons-ID</h3>
      <p>
        Stabil offentlig adresse for lenker til denne seksjonen. Intern element-ID
        brukes ikke i nettadressen.
      </p>

      <form onSubmit={saveAnchor}>
        <label htmlFor={`section-anchor-id-${element.id}`}>
          <span>ID</span>
        </label>
        <div className="section-anchor-properties__input">
          <span aria-hidden="true">#</span>
          <input
            id={`section-anchor-id-${element.id}`}
            value={draft}
            maxLength={80}
            spellCheck={false}
            disabled={element.locked}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
        <button type="submit" disabled={element.locked}>
          Lagre
        </button>
      </form>

      <p className="site-structure__feedback" aria-live="polite">
        {feedback}
      </p>
    </section>
  )
}
