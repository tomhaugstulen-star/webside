import type { EditorElement, ElementKind } from '../../model/editorProject'

const elementKindLabels: Record<ElementKind, string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
}

type RightPropertiesPanelProps = {
  element: EditorElement | null
}

export function RightPropertiesPanel({ element }: RightPropertiesPanelProps) {
  const isOpen = element !== null

  return (
    <aside
      className={`right-properties-panel ${isOpen ? 'right-properties-panel--open' : ''}`}
      aria-hidden={!isOpen}
      aria-labelledby={isOpen ? 'right-properties-panel-title' : undefined}
    >
      {element && (
        <div className="right-properties-panel__content">
          <h2 id="right-properties-panel-title">
            Egenskaper: {elementKindLabels[element.kind]}
          </h2>
          <section aria-label="Element">
            <dl className="right-properties-panel__details">
              <div className="right-properties-panel__detail-row">
                <dt>Status:</dt>
                <dd>{element.locked ? 'Låst' : 'Ulåst'}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </aside>
  )
}
