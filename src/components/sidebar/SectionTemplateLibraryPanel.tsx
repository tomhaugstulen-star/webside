import { useState } from 'react'
import { useSectionTemplateLibrary } from '../../templates/useSectionTemplateLibrary'

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('nb-NO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function SectionTemplateLibraryPanel({
  onBack,
}: {
  onBack: () => void
}) {
  const {
    templates,
    status,
    insertSectionTemplate,
    deleteSectionTemplate,
  } = useSectionTemplateLibrary()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')

  const insert = async (templateId: string) => {
    setBusyId(templateId)
    const result = await insertSectionTemplate(templateId)
    setBusyId(null)
    setFeedback(
      result === 'inserted'
        ? 'Seksjonsmalen er satt inn.'
        : result === 'asset-error'
          ? 'Malen kunne ikke settes inn fordi et bilde ikke kunne lastes.'
          : 'Seksjonsmalen kunne ikke settes inn.',
    )
  }

  const remove = async (templateId: string) => {
    if (!window.confirm('Slette denne seksjonsmalen fra biblioteket?')) return

    setBusyId(templateId)
    const deleted = await deleteSectionTemplate(templateId)
    setBusyId(null)
    setFeedback(
      deleted ? 'Seksjonsmalen er slettet.' : 'Malen kunne ikke slettes.',
    )
  }

  return (
    <>
      <button className="button-library-back" type="button" onClick={onBack}>
        ← Elementer
      </button>
      <h2>Maler</h2>
      <p className="panel-intro">
        Gjenbruk seksjoner du har lagret fra egenskapspanelet.
      </p>

      {status === 'loading' && <p>Laster malbibliotek…</p>}
      {status === 'error' && (
        <p className="template-library__error" role="alert">
          Malbiblioteket har en lokal lagringsfeil.
        </p>
      )}
      {status !== 'loading' && templates.length === 0 && (
        <p className="template-library__empty">
          Ingen seksjonsmaler er lagret ennå.
        </p>
      )}

      <div className="template-library">
        {templates.map((template) => (
          <article className="template-library__card" key={template.id}>
            <div>
              <strong>{template.name}</strong>
              <span>{template.elements.length} elementer</span>
              <time dateTime={template.createdAt}>
                {formatCreatedAt(template.createdAt)}
              </time>
            </div>
            <div className="template-library__actions">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => void insert(template.id)}
              >
                Sett inn
              </button>
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => void remove(template.id)}
              >
                Slett
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="site-structure__feedback" aria-live="polite">
        {feedback}
      </p>
    </>
  )
}
