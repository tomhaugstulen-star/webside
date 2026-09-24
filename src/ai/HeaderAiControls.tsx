import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import { HeaderElementContent } from '../components/canvas/HeaderElementContent'
import { getElementAppearanceCssStyle } from '../components/canvas/getElementAppearanceCssStyle'
import type { ElementLayout } from '../model/elementLayout'
import type {
  HeaderEditorElement,
  ResponsiveViewport,
} from '../model/editorProject'
import { useEditorProject } from '../state/useEditorProject'
import {
  createHeaderAiClip,
  parseHeaderAiProposal,
  type HeaderAiProposal,
} from './headerAiClipboard'
import { renderHeaderAiPreviewPng } from './headerAiImage'

type MenuPosition = { x: number; y: number }

type Props = {
  element: HeaderEditorElement
  viewport: ResponsiveViewport
  layout: ElementLayout
  menuPosition: MenuPosition | null
  onCloseMenu: () => void
}

export function HeaderAiControls({
  element,
  viewport,
  layout,
  menuPosition,
  onCloseMenu,
}: Props) {
  const { state, dispatch } = useEditorProject()
  const { getImageAsset } = useImageAssetStore()
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

  useEffect(() => {
    if (!menuPosition) return
    const close = () => onCloseMenu()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('pointerdown', close)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuPosition, onCloseMenu])

  const copyToChatGpt = async () => {
    setMessage(null)
    onCloseMenu()
    try {
      const clip = createHeaderAiClip({
        element,
        viewport,
        layout,
        project: state.project,
      })

      if (typeof ClipboardItem === 'function' && navigator.clipboard.write) {
        try {
          const logoUrl = getImageAsset(element.logoAssetId)?.objectUrl
          const png = await renderHeaderAiPreviewPng(
            element,
            layout,
            state.project.navigation.items.map((item) => item.label),
            logoUrl,
          )
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/plain': new Blob([clip], { type: 'text/plain' }),
              'image/png': png,
            }),
          ])
          setMessage('ChatGPT-utklipp og Header-bilde kopiert.')
          return
        } catch {
          // Keep the portable text workflow available.
        }
      }

      await navigator.clipboard.writeText(clip)
      setMessage('ChatGPT-utklipp kopiert.')
    } catch {
      setMessage('Kunne ikke kopiere til utklippstavlen.')
    }
  }

  const pasteProposal = async () => {
    setMessage(null)
    onCloseMenu()
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

  const previewElement = proposal
    ? {
        ...element,
        siteName: proposal.siteName,
        subtitle: proposal.subtitle,
        appearance: proposal.appearance,
      }
    : null

  const menuStyle = menuPosition
    ? {
        left: Math.min(menuPosition.x, window.innerWidth - 220),
        top: Math.min(menuPosition.y, window.innerHeight - 110),
      }
    : undefined

  return createPortal(
    <>
      {menuPosition && (
        <div
          className="ai-context-menu"
          style={menuStyle}
          role="menu"
          aria-label="ChatGPT-handlinger"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button type="button" role="menuitem" onClick={() => void copyToChatGpt()}>
            Kopier til ChatGPT
          </button>
          <button type="button" role="menuitem" onClick={() => void pasteProposal()}>
            Lim inn AI-forslag
          </button>
        </div>
      )}

      {message && (
        <div className="ai-context-status" role="status">
          {message}
        </div>
      )}

      {proposal && (
        <div className="ai-preview-backdrop">
          <section
            className="ai-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="AI-forslag til Header"
          >
            <h2>AI-forslag til Header</h2>
            <p>{proposal.width} × {proposal.height} px · {proposal.viewport}</p>
            {previewElement && (
              <div className={`ai-preview-dialog__canvas${proposal.viewport === 'mobile' ? ' canvas-page--mobile' : ''}`}>
                <div
                  className="ai-preview-dialog__header"
                  style={getElementAppearanceCssStyle(previewElement)}
                >
                  <HeaderElementContent
                    element={previewElement}
                    onNavigate={() => undefined}
                    navigationContext={{
                      pages: state.project.pages,
                      navigation: state.project.navigation,
                      activePageId: state.activePageId,
                    }}
                  />
                </div>
              </div>
            )}
            <div className="ai-preview-dialog__summary">
              <div><strong>Navn</strong><span>{proposal.siteName}</span></div>
              <div><strong>Undertittel</strong><span>{proposal.subtitle || 'Ingen'}</span></div>
              <div><strong>Font</strong><span>{proposal.appearance.fontFamily} · {proposal.appearance.fontSize}px</span></div>
              <div><strong>Tekstfarge</strong><span>{proposal.appearance.textColor}</span></div>
            </div>
            <div className="ai-preview-dialog__actions">
              <button type="button" onClick={() => setProposal(null)}>Avbryt</button>
              <button type="button" onClick={applyProposal}>Bruk forslag</button>
            </div>
          </section>
        </div>
      )}
    </>,
    document.body,
  )
}
