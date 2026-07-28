import type { EditorElement, ElementKind } from '../../model/editorProject'
import { ElementLinkPropertiesSection } from './ElementLinkPropertiesSection'
import { TextPropertiesSection } from './TextPropertiesSection'

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
      <div className="right-properties-panel__surface">
        {element && (
          <div className="right-properties-panel__content">
            <h2 id="right-properties-panel-title">Egenskaper</h2>
            <p className="right-properties-panel__element-type">
              {elementKindLabels[element.kind]}
            </p>

            {element.kind === 'text' && (
              <>
                <TextPropertiesSection element={element} />
                <ElementLinkPropertiesSection element={element} />
              </>
            )}

            <section aria-labelledby="right-properties-panel-element-title">
              <h3 id="right-properties-panel-element-title">Element</h3>
              <dl className="right-properties-panel__details">
                <div className="right-properties-panel__detail-row">
                  <dt>Status:</dt>
                  <dd>{element.locked ? 'Låst' : 'Ulåst'}</dd>
                </div>
              </dl>
            </section>
          </div>
        )}
      </div>
    </aside>
  )
}
