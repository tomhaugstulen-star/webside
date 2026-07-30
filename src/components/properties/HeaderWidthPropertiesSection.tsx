import { useId } from 'react'
import type { HeaderEditorElement } from '../../model/editorProject'
import {
  headerWidthModes,
  type HeaderWidthMode,
} from '../../model/headerWidth'
import { useHeaderWidth } from '../../state/useHeaderWidth'

const widthModeLabels: Record<HeaderWidthMode, string> = {
  custom: 'Egen bredde',
  full: 'Kant til kant',
}

type HeaderWidthPropertiesSectionProps = {
  element: HeaderEditorElement
}

export function HeaderWidthPropertiesSection({
  element,
}: HeaderWidthPropertiesSectionProps) {
  const { updateHeaderWidthMode } = useHeaderWidth()
  const idPrefix = useId()
  const selectId = `${idPrefix}-mode`

  return (
    <section
      className="text-properties"
      aria-labelledby={`${idPrefix}-title`}
    >
      <h3 id={`${idPrefix}-title`}>Bredde</h3>
      <div className="text-properties__controls">
        <label className="text-properties__field" htmlFor={selectId}>
          <span>Tilpasning</span>
          <select
            id={selectId}
            value={element.widthMode}
            disabled={element.locked}
            onChange={(event) =>
              updateHeaderWidthMode(
                element.id,
                event.target.value as HeaderWidthMode,
              )
            }
          >
            {headerWidthModes.map((widthMode) => (
              <option key={widthMode} value={widthMode}>
                {widthModeLabels[widthMode]}
              </option>
            ))}
          </select>
        </label>
      </div>
      {element.locked && (
        <p className="text-properties__locked-note">
          Lås opp headeren for å endre bredden.
        </p>
      )}
    </section>
  )
}
