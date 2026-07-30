import { useId } from 'react'
import {
  getProjectColorGroups,
  type ProjectColorTarget,
} from '../../model/projectColorEntries'
import { useEditorProject } from '../../state/useEditorProject'
import { useProjectColors } from '../../state/useProjectColors'
import { ColorSwatchInput } from '../colors/ColorSwatchInput'

export function ColorsPanel() {
  const { activePage } = useEditorProject()
  const {
    updatePageBackgroundColor,
    updateSectionBackgroundColor,
    updateSectionFrameColor,
    updateTextColor,
    updateHeaderTextColor,
    updateHeaderFrameColor,
  } = useProjectColors()
  const idPrefix = useId()
  const groups = getProjectColorGroups(activePage)

  const updateColor = (target: ProjectColorTarget, value: string) => {
    switch (target.type) {
      case 'page-background':
        updatePageBackgroundColor(value)
        return
      case 'section-background':
        updateSectionBackgroundColor(target.elementId, value)
        return
      case 'section-frame':
        updateSectionFrameColor(target.elementId, value)
        return
      case 'text-color':
        updateTextColor(target.elementId, value)
        return
      case 'header-text':
        updateHeaderTextColor(target.elementId, value)
        return
      case 'header-frame':
        updateHeaderFrameColor(target.elementId, value)
        return
    }

    const unhandledTarget: never = target
    return unhandledTarget
  }

  return (
    <div className="colors-panel">
      <h2>Farger</h2>
      <p className="panel-intro">
        Endre fargen på én bestemt del. Andre deler med samme farge påvirkes ikke.
      </p>

      <div className="colors-panel__groups">
        {groups.map((group) => {
          const titleId = `${idPrefix}-${group.id}-title`

          return (
            <section
              key={group.id}
              className="colors-panel__group"
              aria-labelledby={titleId}
            >
              <div className="colors-panel__group-heading">
                <h3 id={titleId}>{group.label}</h3>
                {group.locked && <span> Låst</span>}
              </div>

              <div className="colors-panel__fields">
                {group.entries.map((entry) => (
                  <ColorSwatchInput
                    key={entry.id}
                    id={`${idPrefix}-${entry.id}`}
                    label={entry.label}
                    value={entry.value}
                    disabled={entry.disabled}
                    onChange={(value) => updateColor(entry.target, value)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
