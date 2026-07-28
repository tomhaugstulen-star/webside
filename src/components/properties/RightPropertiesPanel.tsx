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
  const elementKindLabel = element ? elementKindLabels[element.kind] : ''
  const elementStatus = element ? (element.locked ? 'Låst' : 'Ulåst') : ''

  return (
    <aside
      className={`right-properties-panel ${isOpen ? 'right-properties-panel--open' : ''}`}
      aria-hidden={!isOpen}
      aria-labelledby="right-properties-panel-title"
    >
      <div className="right-properties-panel__surface">
        <div className="right-properties-panel__content">
          <h2 id="right-properties-panel-title">Egenskaper</h2>
          <p className="right-properties-panel__element-type">{elementKindLabel}</p>

          <section aria-labelledby="right-properties-panel-element-title">
            <h3 id="right-properties-panel-element-title">Element</h3>
            <dl className="right-properties-panel__details">
              <div className="right-properties-panel__detail-row">
                <dt>Status:</dt>
                <dd>{elementStatus}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </aside>
  )
}
