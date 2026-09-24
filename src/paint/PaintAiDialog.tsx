import { useEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { copyPaintSnapshot } from './copyPaintSnapshot'

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  disabled: boolean
  onClose: () => void
}

export function PaintAiDialog({ canvasRef, disabled, onClose }: Props) {
  const [comment, setComment] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    setPreviewUrl(canvas.toDataURL('image/png'))
    setDimensions({ width: canvas.width, height: canvas.height })
  }, [canvasRef])

  const copySnapshot = async () => {
    const canvas = canvasRef.current
    if (!canvas || disabled) return

    setMessage(null)
    try {
      await copyPaintSnapshot(canvas, comment)
      setMessage('Snapshot med kommentar kopiert. Lim det inn i ChatGPT.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Kunne ikke kopiere snapshot.',
      )
    }
  }

  return createPortal(
    <div className="paint-ai-backdrop">
      <section
        className="paint-ai-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="AI for bilde"
      >
        <header className="paint-ai-dialog__header">
          <div>
            <h2>AI</h2>
            <p>
              {dimensions.width > 0
                ? `${dimensions.width} × ${dimensions.height} px`
                : 'Bilde'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Lukk AI">
            Lukk
          </button>
        </header>

        <div className="paint-ai-dialog__content">
          <div className="paint-ai-dialog__preview">
            {previewUrl && <img src={previewUrl} alt="Snapshot av bildearbeidsflate" />}
          </div>

          <label className="paint-ai-dialog__comment">
            <span>Kommentar</span>
            <textarea
              autoFocus
              value={comment}
              placeholder="Skriv hva du vil at ChatGPT skal gjøre med bildet…"
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>

        <footer className="paint-ai-dialog__footer">
          {message ? <p role="status">{message}</p> : <span />}
          <button type="button" onClick={onClose}>Avbryt</button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => void copySnapshot()}
          >
            Kopier til ChatGPT
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  )
}
