import type { ElementSize, EditorElement } from '../../model/editorProject'
import type { NavigationTarget } from '../../model/navigation'
import { ButtonElementContent } from './ButtonElementContent'
import { HeaderElementContent } from './HeaderElementContent'
import { ImageElementContent } from './ImageElementContent'
import { TextElementEditor, type TextEditFinishReason } from './TextElementEditor'

type EditorCanvasElementContentProps = {
  element: EditorElement
  editing: boolean
  selected: boolean
  frameSize: ElementSize
  onSelect: (elementId: string) => void
  onCommitText: (content: string) => void
  onFinishTextEditing: (reason: TextEditFinishReason) => void
  onNavigate: (target: NavigationTarget) => void
}

export function EditorCanvasElementContent({
  element,
  editing,
  selected,
  frameSize,
  onSelect,
  onCommitText,
  onFinishTextEditing,
  onNavigate,
}: EditorCanvasElementContentProps) {
  switch (element.kind) {
    case 'section':
      return (
        <span className="canvas-element__placeholder" aria-hidden="true">
          Seksjon
        </span>
      )
    case 'image':
      return (
        <ImageElementContent
          element={element}
          frameSize={frameSize}
          selected={selected}
          onSelect={onSelect}
        />
      )
    case 'text':
      return editing ? (
        <TextElementEditor
          initialContent={element.content}
          onCommit={onCommitText}
          onFinish={onFinishTextEditing}
        />
      ) : (
        <span
          className={`canvas-element__text-content ${element.content ? '' : 'canvas-element__text-content--empty'}`}
          aria-hidden="true"
        >
          {element.content || 'Dobbeltklikk for å skrive'}
        </span>
      )
    case 'button':
      return <ButtonElementContent element={element} />
    case 'header':
      return <HeaderElementContent element={element} onNavigate={onNavigate} />
  }

  const unhandledElement: never = element
  return unhandledElement
}
