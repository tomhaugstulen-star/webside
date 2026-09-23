import { useId } from 'react'
import type { EditorFill } from '../../model/editorFill'
import {
  getProjectColorGroups,
  type ProjectColorTarget,
  type ProjectFillTarget,
} from '../../model/projectColorEntries'
import { useEditorProject } from '../../state/useEditorProject'
import { useProjectColors } from '../../state/useProjectColors'
import { BackgroundFillControl } from '../colors/BackgroundFillControl'
import { ColorSwatchInput } from '../colors/ColorSwatchInput'

export function ColorsPanel() {
  const { activePage } = useEditorProject()
  const {
    updatePageBackgroundFill,
    updateSectionBackgroundFill,
    updateSectionFrameColor,
    updateTextBackgroundFill,
    updateTextColor,
    updateHeaderBackgroundFill,
    updateHeaderTextColor,
    updateHeaderFrameColor,
  } = useProjectColors()
  const idPrefix = useId()
  const groups = getProjectColorGroups(activePage)

  const updateFill = (target: ProjectFillTarget, fill: EditorFill) => {
    switch (target.type) {
      case 'page-background':
        updatePageBackgroundFill(fill)
        return
      case 'section-background':
        updateSectionBackgroundFill(target.elementId, fill)
        return
      case 'text-background':
        updateTextBackgroundFill(target.elementId, fill)
        return
      case 'header-background':
        updateHeaderBackgroundFill(target.elementId, fill)
        return
    }

    const unhandledTarget: never = target
    return unhandledTarget
  }

  const updateColor = (target: ProjectColorTarget, value: string) => {
    switch (target.type) {
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
        Endre bakgrunn, gradient og enkeltfarger. Andre deler påvirkes ikke.
      </p>

      <div className="colors-panel__groups">
        {groups.map((group) => {
          const titleId = `${idPrefix}-${group.id}-title`

          return (
            <section key={group.id} className="colors-panel__group" aria-labelledby={titleId}>
              <div className="colors-panel__group-heading">
                <h3 id={titleId}>{group.label}</h3>
                {group.locked && <span>Låst</span>}
              </div>

              <div className="colors-panel__fields">
                {group.entries.map((entry) => (
                  <div className="colors-panel__field" key={entry.id}>
                    {entry.kind === 'fill' ? (
                      <BackgroundFillControl
                        id={`${idPrefix}-${entry.id}`}
                        label={entry.label}
                        fill={entry.fill}
                        disabled={entry.disabled}
                        onChange={(fill) => updateFill(entry.target, fill)}
                      />
                    ) : (
                      <ColorSwatchInput
                        id={`${idPrefix}-${entry.id}`}
                        label={entry.label}
                        value={entry.value}
                        disabled={entry.disabled}
                        onChange={(value) => updateColor(entry.target, value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
