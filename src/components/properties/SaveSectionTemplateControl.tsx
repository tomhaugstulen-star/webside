import { useState, type FormEvent } from 'react'
import type { SectionEditorElement } from '../../model/editorProject'
import { useSectionTemplateLibrary } from '../../templates/useSectionTemplateLibrary'

export function SaveSectionTemplateControl({
  element,
}: {
  element: SectionEditorElement
}) {
  const { saveSectionTemplate } = useSectionTemplateLibrary()
  const [name, setName] = useState('Ny seksjonsmal')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')

  const saveTemplate = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const result = await saveSectionTemplate(element.id, name)
    setSaving(false)

    const messages = {
      saved: 'Malen er lagret i malbiblioteket.',
      'invalid-name': 'Skriv inn et gyldig navn på malen.',
      'section-missing': 'Seksjonen finnes ikke lenger.',
      'asset-missing': 'Malen kunne ikke lagres fordi et bilde mangler.',
      'storage-error': 'Malen kunne ikke lagres lokalt.',
    } as const

    setFeedback(messages[result])
  }

  return (
    <section
      className="section-template-save"
      aria-labelledby="section-template-save-title"
    >
      <h3 id="section-template-save-title">Gjenbrukbar seksjon</h3>
      <p>
        Lagre seksjonen og elementene som ligger helt innenfor den som en mal.
      </p>
      <form onSubmit={(event) => void saveTemplate(event)}>
        <label htmlFor={`section-template-name-${element.id}`}>Malnavn</label>
        <input
          id={`section-template-name-${element.id}`}
          value={name}
          maxLength={80}
          disabled={saving}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit" disabled={saving}>
          {saving ? 'Lagrer…' : 'Lagre som mal'}
        </button>
      </form>
      <p className="site-structure__feedback" aria-live="polite">
        {feedback}
      </p>
    </section>
  )
}
