import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

export type TextEditFinishReason = 'blur' | 'submit' | 'cancel'

type TextElementEditorProps = {
  initialContent: string
  onCommit: (content: string) => void
  onFinish: (reason: TextEditFinishReason) => void
}

export function TextElementEditor({
  initialContent,
  onCommit,
  onFinish,
}: TextElementEditorProps) {
  const [draft, setDraft] = useState(initialContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const finishedRef = useRef(false)

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.focus()
    const caretPosition = textarea.value.length
    textarea.setSelectionRange(caretPosition, caretPosition)
  }, [])

  const finishEditing = (reason: TextEditFinishReason) => {
    if (finishedRef.current) {
      return
    }

    finishedRef.current = true

    if (reason !== 'cancel') {
      onCommit(draft)
    }

    onFinish(reason)
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation()

    if (event.nativeEvent.isComposing) {
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      finishEditing('cancel')
      return
    }

    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      finishEditing('submit')
    }
  }

  const stopPointerPropagation = (event: PointerEvent<HTMLTextAreaElement>) => {
    event.stopPropagation()
  }

  return (
    <textarea
      ref={textareaRef}
      className="canvas-element__text-editor"
      value={draft}
      aria-label="Rediger tekst"
      placeholder="Skriv tekst"
      spellCheck
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPointerDown={stopPointerPropagation}
      onBlur={() => finishEditing('blur')}
    />
  )
}
