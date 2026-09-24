import { useEffect, useState, type FormEvent } from 'react'
import type { EditorElement } from '../../model/editorProject'
import { useEditorProject } from '../../state/useEditorProject'

type ElementNamePropertiesSectionProps = {
  element: EditorElement
}

export function ElementNamePropertiesSection({
  element,
}: ElementNamePropertiesSectionProps) {
  const { dispatch } = useEditorProject()
  const [draft, setDraft] = useState(element.displayName ?? '')

  useEffect(() => {
    setDraft(element.displayName ?? '')
  }, [element.id, element.displayName])

  const save = (event: FormEvent) => {
    event.preventDefault()
    dispatch({
      type: 'set-element-display-name',
      elementId: element.id,
      displayName: draft,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <section className="element-name-properties" aria-labelledby="element-name-title">
      <h3 id="element-name-title">Internt navn</h3>
      <form onSubmit={save}>
        <input
          value={draft}
          maxLength={60}
          placeholder="F.eks. Hero bakgrunn"
          aria-label="Internt navn på element"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Lagre navn</button>
      </form>
      <p>Brukes bare i editoren for å gjøre elementene enklere å finne.</p>
    </section>
  )
}
