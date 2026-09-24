import { useState, type RefObject } from 'react'
import { copyPaintSnapshot } from './copyPaintSnapshot'

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  disabled: boolean
}

export function PaintChatGptPanel({ canvasRef, disabled }: Props) {
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const copySnapshot = async () => {
    const canvas = canvasRef.current
    if (!canvas || disabled) return

    setMessage(null)
    try {
      await copyPaintSnapshot(canvas)
      setMessage('Snapshot kopiert. Lim det inn i ChatGPT.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Kunne ikke kopiere snapshot.',
      )
    }
  }

  return (
    <div className="paint-dialog__panel-group paint-dialog__chatgpt">
      <h3>ChatGPT</h3>
      <label className="paint-dialog__chatgpt-comment">
        Kommentar
        <textarea
          value={comment}
          placeholder="Skriv prompten her mens du ser bildet…"
          onChange={(event) => setComment(event.target.value)}
        />
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => void copySnapshot()}
      >
        Kopier snapshot
      </button>
      {message && (
        <p className="paint-dialog__hint" role="status">
          {message}
        </p>
      )}
    </div>
  )
}
