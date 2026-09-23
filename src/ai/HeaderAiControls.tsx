import { useEffect, useState } from 'react'
import type {
  HeaderEditorElement,
  ResponsiveViewport,
} from '../model/editorProject'
import type { ElementLayout } from '../model/elementLayout'
import { useEditorProject } from '../state/useEditorProject'
import {
  createHeaderAiClip,
  parseHeaderAiProposal,
  type HeaderAiProposal,
} from './headerAiClipboard'

type Props = {
  element: HeaderEditorElement
  viewport: ResponsiveViewport
  layout: ElementLayout
}

export function HeaderAiControls({ element, viewport, layout }: Props) {
  const { state, dispatch } = useEditorProject()
  const [proposal, setProposal] = useState<HeaderAiProposal | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!proposal) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProposal(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [proposal])

  const copyToChatGpt = async () => {
    setMessage(null)
    try {
      const clip = createHeaderAiClip({
        element,
        viewport,
        layout,
        project: state.project,
      })
      await navigator.clipboard.writeText(clip)
      setMessage('ChatGPT-utklipp kopiert.')
    } catch {
      setMessage('Kunne ikke kopiere til utklippstavlen.')
    }
  }

  const pasteProposal = async () => {
    setMessage(null)
    try {
      const text = await navigator.clipboard.readText()
      setProposal(parseHeaderAiProposal(text, {
        elementId: element.id,
        viewport,
        width: layout.size.width,
        height: layout.size.height,
      }))
    } catch (error) {
      setProposal(null)
      setMessage(
        error instanceof Error
          ? error.message
          : 'Dette er ikke et gyldig Website-editor-forslag.',
      )
    }
  }

  const applyProposal = () => {
    if (!proposal) return
    dispatch({
      type: 'apply-header-ai-proposal',
      elementId: element.id,
      siteName: proposal.siteName,
      subtitle: proposal.subtitle,
      appearance: proposal.appearance,
      updatedAt: new Date().toISOString(),
    })
    setProposal(null)
    setMessage('AI-forslaget er brukt.')
  }

  return (
    <>
      <button
        className="canvas-object-toolbar__button canvas-object-toolbar__button--ai"
        type="button"
        onClick={() => void copyToChatGpt()}
      >
        Kopier til ChatGPT
      </button>
      <button
        className="canvas-object-toolbar__button canvas-object-toolbar__button--ai"
        type="button"
        onClick={() => void pasteProposal()}
      >
        Lim inn AI-forslag
      </button>
      {message && <span className="canvas-object-toolbar__status" role="status">{message}</span>}
      {proposal && (
        <div className="ai-preview-backdrop">
          <section className="ai-preview-dialog" role="dialog" aria-modal="true"
            aria-label="AI-forslag til Header">
            <h2>AI-forslag til Header</h2>
            <p>{proposal.width} × {proposal.height} px · {proposal.viewport}</p>
            <div className="ai-preview-dialog__summary">
              <div>
                <strong>Navn</strong>
                <span>{proposal.siteName}</span>
              </div>
              <div>
                <strong>Undertittel</strong>
                <span>{proposal.subtitle || 'Ingen'}</span>
              </div>
              <div>
                <strong>Font</strong>
                <span>{proposal.appearance.fontFamily} · {proposal.appearance.fontSize}px</span>
              </div>
              <div>
                <strong>Tekstfarge</strong>
                <span>{proposal.appearance.textColor}</span>
              </div>
            </div>
            <div className="ai-preview-dialog__actions">
              <button type="button" onClick={() => setProposal(null)}>Avbryt</button>
              <button type="button" onClick={applyProposal}>Bruk forslag</button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
