import { useState } from 'react'
import type {
  ElementCreationRequest,
  StandardElementKind,
} from '../../model/elementCreation'
import { ButtonLibraryPanel } from './ButtonLibraryPanel'
import { SidebarIcon, type SidebarIconName } from './SidebarIcon'

type ElementsPanelProps = {
  onCreateElement: (request: ElementCreationRequest) => void
}

type ElementsPanelView = 'elements' | 'buttons'

const standardItems: Array<{
  kind: StandardElementKind
  label: string
  icon: SidebarIconName
}> = [
  { kind: 'section', label: 'Seksjon', icon: 'section' },
  { kind: 'image', label: 'Bilde', icon: 'image' },
  { kind: 'text', label: 'Tekst', icon: 'text' },
]

export function ElementsPanel({
  onCreateElement,
}: ElementsPanelProps) {
  const [view, setView] = useState<ElementsPanelView>('elements')

  if (view === 'buttons') {
    return (
      <ButtonLibraryPanel
        onBack={() => setView('elements')}
        onCreateButton={(assetId) =>
          onCreateElement({
            kind: 'button',
            assetId,
          })
        }
      />
    )
  }

  return (
    <>
      <h2>Elementer</h2>
      <p className="panel-intro">
        Velg et element for å legge det til på siden.
      </p>

      <div className="element-grid">
        {standardItems.map((item) => (
          <button
            key={item.kind}
            className="element-card"
            type="button"
            onClick={() =>
              onCreateElement({
                kind: item.kind,
              })
            }
          >
            <SidebarIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}

        <button
          className="element-card"
          type="button"
          onClick={() => setView('buttons')}
        >
          <SidebarIcon name="button" />
          <span>Knapp</span>
        </button>
      </div>
    </>
  )
}
