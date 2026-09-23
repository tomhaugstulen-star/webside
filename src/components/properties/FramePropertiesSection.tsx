import { useId } from 'react'
import type {
  HeaderEditorElement,
  HeroEditorElement,
  SectionEditorElement,
  TextEditorElement,
} from '../../model/editorProject'
import {
  elementFrameWidths,
  isElementFrameWidth,
  type ElementFrameWidth,
} from '../../model/elementFrame'
import { useHeaderAppearance } from '../../state/useHeaderAppearance'
import { useHeroProperties } from '../../state/useHeroProperties'
import { useSectionAppearance } from '../../state/useSectionAppearance'
import { useTextAppearance } from '../../state/useTextAppearance'
import { ColorSwatchInput } from '../colors/ColorSwatchInput'

type FramedEditorElement =
  | SectionEditorElement
  | HeaderEditorElement
  | TextEditorElement
  | HeroEditorElement

type FramePropertiesSectionProps = {
  element: FramedEditorElement
}

function getFrameWidthLabel(width: ElementFrameWidth) {
  return width === 0 ? 'Ingen' : `${width} px`
}

export function FramePropertiesSection({
  element,
}: FramePropertiesSectionProps) {
  const { updateSectionFrameWidth, updateSectionFrameColor } =
    useSectionAppearance()
  const { updateHeaderFrameWidth, updateHeaderFrameColor } =
    useHeaderAppearance()
  const { updateTextFrameWidth, updateTextFrameColor } = useTextAppearance()
  const { updateHeroFrameWidth, updateHeroFrameColor } = useHeroProperties()
  const idPrefix = useId()
  const widthId = `${idPrefix}-width`
  const colorId = `${idPrefix}-color`
  const disabled = element.locked

  const updateFrameWidth = (width: ElementFrameWidth) => {
    switch (element.kind) {
      case 'section':
        updateSectionFrameWidth(element.id, width)
        return
      case 'header':
        updateHeaderFrameWidth(element.id, width)
        return
      case 'text':
        updateTextFrameWidth(element.id, width)
        return
      case 'hero':
        updateHeroFrameWidth(element.id, width)
    }
  }

  const updateFrameColor = (value: string) => {
    switch (element.kind) {
      case 'section':
        updateSectionFrameColor(element.id, value)
        return
      case 'header':
        updateHeaderFrameColor(element.id, value)
        return
      case 'text':
        updateTextFrameColor(element.id, value)
        return
      case 'hero':
        updateHeroFrameColor(element.id, value)
    }
  }

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
              if (isElementFrameWidth(width)) updateFrameWidth(width)
            }}
          >
            {elementFrameWidths.map((width) => (
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
          onChange={updateFrameColor}
        />
      </div>

      {disabled && (
        <p className="frame-properties__locked-note">
          Lås opp elementet for å endre rammen.
        </p>
      )}
    </section>
  )
}
