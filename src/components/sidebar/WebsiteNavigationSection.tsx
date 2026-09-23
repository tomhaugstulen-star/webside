import { useMemo, useState, type FormEvent } from 'react'
import {
  isValidNavigationLabel,
  normalizeNavigationLabel,
} from '../../model/navigation'
import { useEditorProject } from '../../state/useEditorProject'
import { useNavigationActions } from '../../state/useNavigationActions'
import { NavigationItemEditor } from './NavigationItemEditor'
import {
  createNavigationTargetOptions,
} from './navigationTargetOptions'

export function WebsiteNavigationSection() {
  const { state } = useEditorProject()
  const { addNavigationItem } = useNavigationActions()
  const options = useMemo(
    () => createNavigationTargetOptions(state.project.pages),
    [state.project.pages],
  )
  const activePageTargetValue = `page:${state.activePageId}`
  const initialTarget =
    options.find((option) => option.value === activePageTargetValue) ??
    options[0]
  const [labelDraft, setLabelDraft] = useState('')
  const [targetValue, setTargetValue] = useState(initialTarget?.value ?? '')
  const [parentId, setParentId] = useState('')
  const selectedParentId = state.project.navigation.items.some(
    (item) => item.id === parentId && !item.parentId,
  ) ? parentId : ''
  const [feedback, setFeedback] = useState('')
  const selectedTarget =
    options.find((option) => option.value === targetValue) ??
    options.find((option) => option.value === activePageTargetValue) ??
    options[0]
  const selectedTargetValue = selectedTarget?.value ?? ''
  const orderedItems = state.project.navigation.items
    .filter((item) => !item.parentId)
    .flatMap((item) => [item, ...state.project.navigation.items.filter(
      (child) => child.parentId === item.id,
    )])

  const addItem = (event: FormEvent) => {
    event.preventDefault()
    const normalized = normalizeNavigationLabel(labelDraft)

    if (!isValidNavigationLabel(normalized)) {
      setFeedback('Skriv en menutekst på maks 80 tegn.')
      return
    }

    if (!selectedTarget) {
      setFeedback('Velg et gyldig navigasjonsmål.')
      return
    }

    addNavigationItem(normalized, selectedTarget.target, selectedParentId || undefined)
    setLabelDraft('')
    setParentId('')
    setFeedback('Menypunktet er lagt til.')
  }

  return (
    <section
      className="website-navigation"
      aria-labelledby="website-navigation-title"
    >
      <div className="site-structure__section-heading">
        <h3 id="website-navigation-title">Nettstedmeny</h3>
        <span>{state.project.navigation.items.length}</span>
      </div>

      <p className="site-structure__hint">
        Legg til sider og seksjoner i Header. Velg et overordnet menypunkt for rullegardin.
      </p>

      <form className="website-navigation__add-form" onSubmit={addItem}>
        <label>
          <span>Menutekst</span>
          <input
            value={labelDraft}
            maxLength={80}
            placeholder="For eksempel Om oss"
            onChange={(event) => setLabelDraft(event.target.value)}
          />
        </label>

        <label>
          <span>Mål</span>
          <select
            value={selectedTargetValue}
            onChange={(event) => setTargetValue(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Plassering</span>
          <select value={selectedParentId} onChange={(event) => setParentId(event.target.value)}>
            <option value="">Hovedmeny</option>
            {state.project.navigation.items.filter((item) => !item.parentId).map((item) => (
              <option key={item.id} value={item.id}>Under {item.label} (rullegardin)</option>
            ))}
          </select>
        </label>

        <button type="submit">Legg til menypunkt</button>
      </form>

      <p className="site-structure__feedback" aria-live="polite">
        {feedback}
      </p>

      {state.project.navigation.items.length === 0 ? (
        <p className="website-navigation__empty">Ingen menypunkter ennå.</p>
      ) : (
        <ol className="website-navigation__list">
          {orderedItems.map((item) => (
            <NavigationItemEditor
              key={item.id}
              item={item}
              options={options}
              allItems={state.project.navigation.items}
            />
          ))}
        </ol>
      )}
    </section>
  )
}
