import { useId } from 'react'
import { ColorSwatchInput } from '../colors/ColorSwatchInput'
import type { SectionEditorElement } from '../../model/editorProject'
import {
  isSectionFrameWidth,
  sectionFrameWidths,
  type SectionFrameWidth,
} from '../../model/sectionAppearance'
import { useSectionAppearance } from '../../state/useSectionAppearance'

type FramePropertiesSectionProps = {
  element: SectionEditorElement
}

function getFrameWidthLabel(width: SectionFrameWidth) {
  return width === 0 ? 'Ingen' : `${width} px`
}

export function FramePropertiesSection({
  element,
}: FramePropertiesSectionProps) {
  const { updateSectionFrameWidth, updateSectionFrameColor } =
    useSectionAppearance()
  const idPrefix = useId()
  const widthId = `${idPrefix}-width`
  const colorId = `${idPrefix}-color`
  const disabled = element.locked

  return (
    <section className="frame-properties" aria-labelledby={`${idPrefix}-title`}>
      <h3 id={`${idPrefix}-title`}>Ramme</h3>

      <div className="frame-properties__controls">
        <label className="frame-properties__field" htmlFor={widthId}>
          <span>Tykkelse</span>
          <select
            id={widthId}
            value={element.appearance.frame.width}
            disabled={disabled}
            onChange={(event) => {
              const width = Number(event.target.value)

              if (isSectionFrameWidth(width)) {
                updateSectionFrameWidth(element.id, width)
              }
            }}
          >
            {sectionFrameWidths.map((width) => (
              <option key={width} value={width}>
                {getFrameWidthLabel(width)}
              </option>
            ))}
          </select>
        </label>

        <ColorSwatchInput
          id={colorId}
          label="Farge"
          value={element.appearance.frame.color}
          disabled={disabled}
          onChange={(value) => updateSectionFrameColor(element.id, value)}
        />
      </div>

      {disabled && (
        <p className="frame-properties__locked-note">
          Lås opp seksjonen for å endre rammen.
        </p>
      )}
    </section>
  )
}
