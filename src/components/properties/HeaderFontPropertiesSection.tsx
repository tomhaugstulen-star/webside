import type { HeaderEditorElement } from '../../model/editorProject'
import {
  textFontFamilies,
  textFontSizes,
  type TextFontFamily,
  type TextFontSize,
} from '../../model/textElementStyle'
import { useHeaderAppearance } from '../../state/useHeaderAppearance'
import { textFontFamilyLabels } from './textFontFamilyLabels'

type HeaderFontPropertiesSectionProps = {
  element: HeaderEditorElement
}

export function HeaderFontPropertiesSection({
  element,
}: HeaderFontPropertiesSectionProps) {
  const { updateHeaderFontFamily, updateHeaderFontSize } =
    useHeaderAppearance()

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

        <label
          className="text-properties__field"
          htmlFor="header-font-properties-size"
        >
          <span>Størrelse</span>
          <select
            id="header-font-properties-size"
            value={element.appearance.fontSize}
            onChange={(event) =>
              updateHeaderFontSize(
                element.id,
                Number(event.target.value) as TextFontSize,
              )
            }
          >
            {textFontSizes.map((fontSize) => (
              <option key={fontSize} value={fontSize}>
                {fontSize} px
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}
