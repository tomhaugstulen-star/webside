import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import type { ElementLayout } from '../model/elementLayout'
import type { EditorElement } from '../model/editorProject'
import { imageFileToPngBlob } from './clipboardImage'
import {
  createElementAiClip,
  getElementAiLabel,
  getElementAiTypeLabel,
} from './elementAiClipboard'

type MenuPosition = { x: number; y: number }

type Props = {
  element: EditorElement
  layout: ElementLayout
  position: MenuPosition
  onClose: () => void
}

function getElementImageAssetId(element: EditorElement) {
  if (element.kind === 'image') return element.assetId
  if (element.kind === 'hero') return element.imageAssetId
  if (element.kind === 'header') return element.logoAssetId
  return null
}

export function ElementAiContextPanel({
  element,
  layout,
  position,
  onClose,
}: Props) {
  const { getImageAsset } = useImageAssetStore()
  const [instruction, setInstruction] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const copyToChatGpt = async () => {
    const clip = createElementAiClip(element, layout, instruction)
    const assetId = getElementImageAssetId(element)
    const resource = assetId ? getImageAsset(assetId) : null

    try {
      if (
        resource &&
        typeof ClipboardItem === 'function' &&
        navigator.clipboard.write
      ) {
        try {
          const png = await imageFileToPngBlob(resource.file)
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/plain': new Blob([clip], { type: 'text/plain' }),
              'image/png': png,
            }),
          ])
          setMessage('Tekst og bilde er kopiert til ChatGPT.')
          return
        } catch {
          // Fall back to the portable text clipboard.
        }
      }

      await navigator.clipboard.writeText(clip)
      setMessage('Kopiert til ChatGPT.')
    } catch {
      setMessage('Kunne ikke kopiere til utklippstavlen.')
    }
  }

  const style = {
    left: Math.max(12, Math.min(position.x, window.innerWidth - 332)),
    top: Math.max(12, Math.min(position.y, window.innerHeight - 360)),
  }

  return createPortal(
    <div
      className="ai-element-panel"
      style={style}
      role="dialog"
      aria-label="Send element til ChatGPT"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="ai-element-panel__meta">
        <span><strong>Type</strong>{getElementAiTypeLabel(element)}</span>
        <span><strong>Element</strong>{getElementAiLabel(element)}</span>
        <span><strong>Width</strong>{Math.round(layout.size.width)} px</span>
        <span><strong>Height</strong>{Math.round(layout.size.height)} px</span>
      </div>

      <label className="ai-element-panel__instruction">
        <span>Kommentar</span>
        <textarea
          autoFocus
          value={instruction}
          placeholder="Skriv hva du vil at ChatGPT skal lage eller endre…"
          onChange={(event) => setInstruction(event.target.value)}
        />
      </label>

      {message && <p className="ai-element-panel__status" role="status">{message}</p>}

      <div className="ai-element-panel__actions">
        <button type="button" onClick={onClose}>Lukk</button>
        <button type="button" onClick={() => void copyToChatGpt()}>
          Kopier til ChatGPT
        </button>
      </div>
    </div>,
    document.body,
  )
}
