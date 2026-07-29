import { useState } from 'react'
import type {
  ElementCreationRequest,
  StandardElementKind,
} from '../../model/elementCreation'
import { ButtonLibraryPanel } from './ButtonLibraryPanel'
import { ImageImportControl } from './ImageImportControl'
import { SidebarIcon, type SidebarIconName } from './SidebarIcon'

type ElementsPanelProps = {
  onCreateElement: (request: ElementCreationRequest) => boolean
}

type ElementsPanelView = 'elements' | 'buttons'

type StandardElementItem = {
  kind: StandardElementKind
  label: string
  icon: SidebarIconName
}

const sectionItem: StandardElementItem = {
  kind: 'section',
  label: 'Seksjon',
  icon: 'section',
}

const textItem: StandardElementItem = {
  kind: 'text',
  label: 'Tekst',
  icon: 'text',
}

function StandardElementCard({
  item,
  onCreateElement,
}: {
  item: StandardElementItem
  onCreateElement: ElementsPanelProps['onCreateElement']
}) {
  return (
    <button
      className="element-card"
      type="button"
      onClick={() => onCreateElement({ kind: item.kind })}
    >
      <SidebarIcon name={item.icon} />
      <span>{item.label}</span>
    </button>
  )
}

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
        <StandardElementCard
          item={sectionItem}
          onCreateElement={onCreateElement}
        />
        <ImageImportControl onCreateImage={onCreateElement} />
        <StandardElementCard item={textItem} onCreateElement={onCreateElement} />

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
