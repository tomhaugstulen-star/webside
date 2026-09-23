import { useState, type FormEvent } from 'react'
import type { NavigationItem } from '../../model/navigation'
import {
  isValidNavigationLabel,
  normalizeNavigationLabel,
} from '../../model/navigation'
import { useNavigationActions } from '../../state/useNavigationActions'
import {
  navigationTargetValue,
  type NavigationTargetOption,
} from './navigationTargetOptions'

type NavigationItemEditorProps = {
  item: NavigationItem
  options: readonly NavigationTargetOption[]
  allItems: readonly NavigationItem[]
}

export function NavigationItemEditor({
  item,
  options,
  allItems,
}: NavigationItemEditorProps) {
  const {
    setNavigationItemLabel,
    setNavigationItemTarget,
    setNavigationItemParent,
    moveNavigationItem,
    deleteNavigationItem,
  } = useNavigationActions()
  const [labelDraft, setLabelDraft] = useState(item.label)
  const [feedback, setFeedback] = useState('')

  const saveLabel = (event: FormEvent) => {
    event.preventDefault()
    const normalized = normalizeNavigationLabel(labelDraft)

    if (!isValidNavigationLabel(normalized)) {
      setFeedback('Menypunktet må ha en tekst på maks 80 tegn.')
      return
    }

    setLabelDraft(normalized)
    setNavigationItemLabel(item.id, normalized)
    setFeedback(
      normalized === item.label ? 'Teksten er uendret.' : 'Teksten er lagret.',
    )
  }

  const targetValue = navigationTargetValue(item.target)
  const siblings = allItems.filter((candidate) => candidate.parentId === item.parentId)
  const siblingIndex = siblings.findIndex((candidate) => candidate.id === item.id)

  return (
    <li className={`website-navigation__item${item.parentId ? ' website-navigation__item--child' : ''}`}>
      <form className="site-structure__form" onSubmit={saveLabel}>
        <label>
          <span>Menutekst</span>
          <input
            value={labelDraft}
            maxLength={80}
            onChange={(event) => setLabelDraft(event.target.value)}
          />
        </label>
        <button type="submit">Lagre</button>
      </form>

      <label className="site-structure__select-field">
        <span>Mål</span>
        <select
          value={targetValue}
          onChange={(event) => {
            const option = options.find(
              (candidate) => candidate.value === event.target.value,
            )

            if (option) {
              setNavigationItemTarget(item.id, option.target)
              setFeedback('Navigasjonsmålet er lagret.')
            }
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="site-structure__select-field">
        <span>Plassering</span>
        <select value={item.parentId ?? ''} onChange={(event) =>
          setNavigationItemParent(item.id, event.target.value || null)}>
          <option value="">Hovedmeny</option>
          {allItems.filter((candidate) => candidate.id !== item.id && !candidate.parentId &&
            !allItems.some((child) => child.parentId === item.id)).map((candidate) => (
              <option key={candidate.id} value={candidate.id}>Under {candidate.label} (rullegardin)</option>
            ))}
        </select>
      </label>

      <div className="site-structure__button-row">
        <button
          type="button"
          disabled={siblingIndex <= 0}
          onClick={() => moveNavigationItem(item.id, 'up')}
        >
          Opp
        </button>
        <button
          type="button"
          disabled={siblingIndex >= siblings.length - 1}
          onClick={() => moveNavigationItem(item.id, 'down')}
        >
          Ned
        </button>
        <button type="button" onClick={() => deleteNavigationItem(item.id)}>
          Fjern
        </button>
      </div>

      <p className="site-structure__feedback" aria-live="polite">
        {feedback}
      </p>
    </li>
  )
}
