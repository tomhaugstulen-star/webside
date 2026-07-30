import type { TextEditorElement } from '../../model/editorProject'
import {
  textFontFamilies,
  textFontSizes,
  textLineHeights,
  type TextAlignment,
  type TextFontFamily,
  type TextFontSize,
  type TextLineHeight,
} from '../../model/textElementStyle'
import { useTextElementStyle } from '../../state/useTextElementStyle'
import { textFontFamilyLabels } from './textFontFamilyLabels'

const alignmentLabels: Record<TextAlignment, string> = {
  left: 'Venstre',
  center: 'Midt',
  right: 'Høyre',
}

const lineHeightLabels: Record<TextLineHeight, string> = {
  1: '1,0',
  1.2: '1,2',
  1.45: '1,45',
  1.6: '1,6',
  1.8: '1,8',
  2: '2,0',
}

const alignments = Object.keys(alignmentLabels) as TextAlignment[]

type TextPropertiesSectionProps = {
  element: TextEditorElement
}

export function TextPropertiesSection({ element }: TextPropertiesSectionProps) {
  const { updateTextElementStyle } = useTextElementStyle()
  const { textStyle } = element
  const disabled = element.locked

  return (
    <section
      className="text-properties"
      aria-labelledby="text-properties-title"
    >
      <h3 id="text-properties-title">Tekstutseende</h3>

      <div className="text-properties__controls">
        <label className="text-properties__field" htmlFor="text-properties-font">
          <span>Font</span>
          <select
            id="text-properties-font"
            value={textStyle.fontFamily}
            disabled={disabled}
            onChange={(event) =>
              updateTextElementStyle(element.id, {
                fontFamily: event.target.value as TextFontFamily,
              })
            }
          >
            {textFontFamilies.map((fontFamily) => (
              <option key={fontFamily} value={fontFamily}>
                {textFontFamilyLabels[fontFamily]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-properties__field" htmlFor="text-properties-size">
          <span>Størrelse</span>
          <select
            id="text-properties-size"
            value={textStyle.fontSize}
            disabled={disabled}
            onChange={(event) =>
              updateTextElementStyle(element.id, {
                fontSize: Number(event.target.value) as TextFontSize,
              })
            }
          >
            {textFontSizes.map((fontSize) => (
              <option key={fontSize} value={fontSize}>
                {fontSize} px
              </option>
            ))}
          </select>
        </label>

        <div className="text-properties__field">
          <span>Stil</span>
          <div
            className="text-properties__button-group"
            role="group"
            aria-label="Skriftstil"
          >
            <button
              type="button"
              aria-pressed={textStyle.fontWeight === 'bold'}
              disabled={disabled}
              onClick={() =>
                updateTextElementStyle(element.id, {
                  fontWeight: textStyle.fontWeight === 'bold' ? 'normal' : 'bold',
                })
              }
            >
              Fet
            </button>
            <button
              type="button"
              aria-pressed={textStyle.fontStyle === 'italic'}
              disabled={disabled}
              onClick={() =>
                updateTextElementStyle(element.id, {
                  fontStyle: textStyle.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
            >
              Kursiv
            </button>
          </div>
        </div>

        <div className="text-properties__field">
          <span>Justering</span>
          <div
            className="text-properties__button-group text-properties__button-group--alignment"
            role="group"
            aria-label="Tekstjustering"
          >
            {alignments.map((alignment) => (
              <button
                key={alignment}
                type="button"
                aria-pressed={textStyle.textAlign === alignment}
                disabled={disabled}
                onClick={() =>
                  updateTextElementStyle(element.id, { textAlign: alignment })
                }
              >
                {alignmentLabels[alignment]}
              </button>
            ))}
          </div>
        </div>

        <label
          className="text-properties__field"
          htmlFor="text-properties-line-height"
        >
          <span>Linjehøyde</span>
          <select
            id="text-properties-line-height"
            value={textStyle.lineHeight}
            disabled={disabled}
            onChange={(event) =>
              updateTextElementStyle(element.id, {
                lineHeight: Number(event.target.value) as TextLineHeight,
              })
            }
          >
            {textLineHeights.map((lineHeight) => (
              <option key={lineHeight} value={lineHeight}>
                {lineHeightLabels[lineHeight]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {disabled && (
        <p className="text-properties__locked-note">
          Lås opp elementet for å endre tekstutseendet.
        </p>
      )}
    </section>
  )
}
