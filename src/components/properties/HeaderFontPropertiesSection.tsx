import type { HeaderEditorElement } from '../../model/editorProject'
import {
  textFontFamilies,
  type TextFontFamily,
} from '../../model/textElementStyle'
import { useHeaderAppearance } from '../../state/useHeaderAppearance'
import { textFontFamilyLabels } from './textFontFamilyLabels'

type HeaderFontPropertiesSectionProps = {
  element: HeaderEditorElement
}

export function HeaderFontPropertiesSection({
  element,
}: HeaderFontPropertiesSectionProps) {
  const { updateHeaderFontFamily } = useHeaderAppearance()
  const disabled = element.locked

  return (
    <section
      className="text-properties"
      aria-labelledby="header-font-properties-title"
    >
      <h3 id="header-font-properties-title">Tekstutseende</h3>

      <div className="text-properties__controls">
        <label
          className="text-properties__field"
          htmlFor="header-font-properties-family"
        >
          <span>Font</span>
          <select
            id="header-font-properties-family"
            value={element.appearance.fontFamily}
            disabled={disabled}
            onChange={(event) =>
              updateHeaderFontFamily(
                element.id,
                event.target.value as TextFontFamily,
              )
            }
          >
            {textFontFamilies.map((fontFamily) => (
              <option key={fontFamily} value={fontFamily}>
                {textFontFamilyLabels[fontFamily]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {disabled && (
        <p className="text-properties__locked-note">
          Lås opp headeren for å endre fonten.
        </p>
      )}
    </section>
  )
}
