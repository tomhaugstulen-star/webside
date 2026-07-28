import {
  useEffect,
  useRef,
  type MouseEvent,
  type SyntheticEvent,
} from 'react'
import type { ElementKind } from '../../model/editorProject'

const deletionTitles: Record<ElementKind, string> = {
  section: 'Slett seksjonen?',
  image: 'Slett bildet?',
  text: 'Slett tekstboksen?',
  button: 'Slett knappen?',
}

type ConfirmElementDeletionDialogProps = {
  kind: ElementKind
  targetExists: boolean
  targetLocked: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmElementDeletionDialog({
  kind,
  targetExists,
  targetLocked,
  onCancel,
  onConfirm,
}: ConfirmElementDeletionDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const canConfirm = targetExists && !targetLocked
  const unavailableMessage = !targetExists
    ? 'Elementet finnes ikke lenger.'
    : targetLocked
      ? 'Elementet er låst og kan ikke slettes.'
      : null

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (!dialog.open) {
      dialog.showModal()
    }

    const focusFrame = requestAnimationFrame(() => cancelButtonRef.current?.focus())

    return () => {
      cancelAnimationFrame(focusFrame)

      if (dialog.open) {
        dialog.close()
      }
    }
  }, [])

  const handleNativeCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onCancel()
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onCancel()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="element-deletion-dialog"
      aria-labelledby="element-deletion-dialog-title"
      aria-describedby="element-deletion-dialog-description"
      onCancel={handleNativeCancel}
      onClick={handleBackdropClick}
    >
      <div className="element-deletion-dialog__content">
        <h2 id="element-deletion-dialog-title">{deletionTitles[kind]}</h2>
        <p id="element-deletion-dialog-description">Dette kan ikke angres.</p>
        {unavailableMessage && (
          <p className="element-deletion-dialog__unavailable" role="status">
            {unavailableMessage}
          </p>
        )}
        <div className="element-deletion-dialog__actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="element-deletion-dialog__cancel"
            onClick={onCancel}
          >
            Avbryt
          </button>
          <button
            type="button"
            className="element-deletion-dialog__confirm"
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            Slett
          </button>
        </div>
      </div>
    </dialog>
  )
}
