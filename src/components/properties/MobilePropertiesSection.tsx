import type { EditorElement } from '../../model/editorProject'
import { useResponsiveElementControls } from '../../state/useResponsiveElementControls'

function getMobileStatus(element: EditorElement) {
  if (element.visibility.mobile === false) return 'Skjult på mobil'

  if (
    element.position.mobile !== undefined ||
    element.size.mobile !== undefined ||
    element.visibility.mobile !== undefined
  ) {
    return 'Eget mobiloppsett'
  }

  return 'Arver fra PC'
}

export function MobilePropertiesSection({
  element,
}: {
  element: EditorElement
}) {
  const { setMobileVisibility, resetMobileOverrides } =
    useResponsiveElementControls()
  const hiddenOnMobile = element.visibility.mobile === false
  const hasMobileOverride =
    element.position.mobile !== undefined ||
    element.size.mobile !== undefined ||
    element.visibility.mobile !== undefined

  return (
    <section
      className="mobile-properties"
      aria-labelledby="mobile-properties-title"
    >
      <h3 id="mobile-properties-title">Telefon</h3>
      <div className="mobile-properties__status">
        <span>Status</span>
        <strong>{getMobileStatus(element)}</strong>
      </div>
      <div className="mobile-properties__actions">
        <button
          type="button"
          onClick={() => setMobileVisibility(element.id, hiddenOnMobile)}
        >
          {hiddenOnMobile ? 'Vis på mobil' : 'Skjul på mobil'}
        </button>
        <button
          type="button"
          disabled={!hasMobileOverride}
          onClick={() => resetMobileOverrides(element.id)}
        >
          Bruk PC-oppsett
        </button>
      </div>
    </section>
  )
}
