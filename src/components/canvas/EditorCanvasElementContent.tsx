import type { ElementSize, EditorElement } from '../../model/editorProject'
import { ButtonElementContent } from './ButtonElementContent'
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
}

export function EditorCanvasElementContent({
  element,
  editing,
  selected,
  frameSize,
  onSelect,
  onCommitText,
  onFinishTextEditing,
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
  }

  const unhandledElement: never = element
  return unhandledElement
}
