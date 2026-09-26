import { useState, type KeyboardEvent } from 'react'
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
  const [saved, setSaved] = useState(false)

  const save = () => {
    dispatch({
      type: 'set-element-display-name',
      elementId: element.id,
      displayName: draft,
      updatedAt: new Date().toISOString(),
    })
    setSaved(true)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    save()
  }

  return (
    <section className="element-name-properties" aria-labelledby="element-name-title">
      <h3 id="element-name-title">Internt navn</h3>
      <div className="element-name-properties__controls">
        <input
          value={draft}
          maxLength={60}
          placeholder="F.eks. Hero bakgrunn"
          aria-label="Internt navn på element"
          onChange={(event) => {
            setDraft(event.target.value)
            setSaved(false)
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={save}
        >
          Lagre navn
        </button>
      </div>
      <p>
        Brukes bare i editoren for å gjøre elementene enklere å finne.
        {saved ? ' Lagret.' : ''}
      </p>
    </section>
  )
}
