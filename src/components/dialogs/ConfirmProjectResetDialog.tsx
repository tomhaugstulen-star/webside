import {
  useEffect,
  useRef,
  type MouseEvent,
  type SyntheticEvent,
} from 'react'

type ConfirmProjectResetDialogProps = {
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmProjectResetDialog({
  busy,
  onCancel,
  onConfirm,
}: ConfirmProjectResetDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (!dialog.open) {
      dialog.showModal()
    }

    const focusFrame = requestAnimationFrame(() => {
      cancelButtonRef.current?.focus()
    })

    return () => {
      cancelAnimationFrame(focusFrame)

      if (dialog.open) {
        dialog.close()
      }
    }
  }, [])

  const handleNativeCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()

    if (!busy) {
      onCancel()
    }
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && !busy) {
      onCancel()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="project-reset-dialog"
      aria-labelledby="project-reset-dialog-title"
      aria-describedby="project-reset-dialog-description"
      onCancel={handleNativeCancel}
      onClick={handleBackdropClick}
    >
      <div className="project-reset-dialog__content">
        <h2 id="project-reset-dialog-title">Nullstill lokalt prosjekt?</h2>
        <p id="project-reset-dialog-description">
          Prosjektdata og importerte bilder slettes fra denne nettleseren. Dette
          kan ikke angres.
        </p>
        <div className="project-reset-dialog__actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="project-reset-dialog__cancel"
            disabled={busy}
            onClick={onCancel}
          >
            Avbryt
          </button>
          <button
            type="button"
            className="project-reset-dialog__confirm"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? 'Nullstiller…' : 'Nullstill'}
          </button>
        </div>
      </div>
    </dialog>
  )
}
