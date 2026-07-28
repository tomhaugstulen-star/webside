import type { EditorElement, ElementKind } from '../../model/editorProject'

const deleteButtonLabels: Record<ElementKind, string> = {
  section: 'Slett seksjon',
  image: 'Slett bilde',
  text: 'Slett tekstboks',
  button: 'Slett knapp',
}

type DeleteElementSectionProps = {
  element: EditorElement
  onRequestDeletion: (
    element: EditorElement,
    returnFocus: HTMLElement | null,
  ) => void
}

export function DeleteElementSection({
  element,
  onRequestDeletion,
}: DeleteElementSectionProps) {
  const lockedMessageId = `delete-element-locked-${element.id}`

  return (
    <div className="element-deletion">
      <button
        type="button"
        className="element-deletion__button"
        disabled={element.locked}
        aria-describedby={element.locked ? lockedMessageId : undefined}
        onClick={(event) => onRequestDeletion(element, event.currentTarget)}
      >
        {deleteButtonLabels[element.kind]}
      </button>
      {element.locked && (
        <p id={lockedMessageId} className="element-deletion__locked-note">
          Lås opp elementet før det kan slettes.
        </p>
      )}
    </div>
  )
}
