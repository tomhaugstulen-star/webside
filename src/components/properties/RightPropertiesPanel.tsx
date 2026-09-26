import type { EditorElement, ElementKind } from '../../model/editorProject'
import { ButtonPropertiesSection } from './ButtonPropertiesSection'
import { DeleteElementSection } from './DeleteElementSection'
import { ElementLinkPropertiesSection } from './ElementLinkPropertiesSection'
import { ElementNamePropertiesSection } from './ElementNamePropertiesSection'
import { FramePropertiesSection } from './FramePropertiesSection'
import { HeaderFontPropertiesSection } from './HeaderFontPropertiesSection'
import { HeaderPropertiesSection } from './HeaderPropertiesSection'
import { HeroPropertiesSection } from './HeroPropertiesSection'
import { ImagePropertiesSection } from './ImagePropertiesSection'
import { MobilePropertiesSection } from './MobilePropertiesSection'
import { SectionAnchorPropertiesSection } from './SectionAnchorPropertiesSection'
import { SaveSectionTemplateControl } from './SaveSectionTemplateControl'
import { TextPropertiesSection } from './TextPropertiesSection'

const elementKindLabels: Record<ElementKind, string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
  header: 'Header',
  hero: 'Hero',
}

type RightPropertiesPanelProps = {
  element: EditorElement | null
  onClose: () => void
  onRequestElementDeletion: (
    element: EditorElement,
    returnFocus: HTMLElement | null,
  ) => void
}

export function RightPropertiesPanel({
  element,
  onClose,
  onRequestElementDeletion,
}: RightPropertiesPanelProps) {
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
            <div className="right-properties-panel__heading">
              <div>
                <h2 id="right-properties-panel-title">Egenskaper</h2>
                <p className="right-properties-panel__element-type">
                  {elementKindLabels[element.kind]}
                </p>
              </div>
              <button
                type="button"
                className="right-properties-panel__close"
                aria-label="Lukk egenskaper"
                title="Lukk"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            {element.kind === 'header' && (
              <HeaderPropertiesSection key={element.id} element={element} />
            )}

            {element.kind === 'header' && (
              <HeaderFontPropertiesSection element={element} />
            )}

            {element.kind === 'hero' && (
              <HeroPropertiesSection key={element.id} element={element} />
            )}

            {element.kind === 'section' && (
              <>
                <SectionAnchorPropertiesSection key={element.id} element={element} />
                <SaveSectionTemplateControl element={element} />
              </>
            )}

            {(element.kind === 'section' ||
              element.kind === 'header' ||
              element.kind === 'text' ||
              element.kind === 'hero') && (
              <FramePropertiesSection element={element} />
            )}

            {element.kind === 'image' && (
              <ImagePropertiesSection key={element.id} element={element} />
            )}

            {element.kind === 'text' && (
              <TextPropertiesSection element={element} />
            )}

            {element.kind === 'button' && (
              <ButtonPropertiesSection key={element.id} element={element} />
            )}

            {(element.kind === 'text' ||
              (element.kind === 'button' && !element.dropdown) ||
              (element.kind === 'hero' && element.ctaLabel)) && (
              <ElementLinkPropertiesSection element={element} />
            )}

            <ElementNamePropertiesSection key={element.id} element={element} />

            <MobilePropertiesSection element={element} />

            <section aria-labelledby="right-properties-panel-element-title">
              <h3 id="right-properties-panel-element-title">Element</h3>
              {element.kind !== 'header' && (
                <dl className="right-properties-panel__details">
                  <div className="right-properties-panel__detail-row">
                    <dt>Status:</dt>
                    <dd>{element.locked ? 'Låst' : 'Ulåst'}</dd>
                  </div>
                </dl>
              )}
              <DeleteElementSection
                element={element}
                onRequestDeletion={onRequestElementDeletion}
              />
            </section>
          </div>
        )}
      </div>
    </aside>
  )
}
