import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import type { EditorElement } from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import type { ViewportMode } from '../../types/editor'

const elementKindLabels: Record<EditorElement['kind'], string> = {
  section: 'Seksjon',
  image: 'Bilde',
  text: 'Tekst',
  button: 'Knapp',
}

type EditorCanvasElementProps = {
  element: EditorElement
  viewport: ViewportMode
  selected: boolean
  onSelect: (elementId: string) => void
}

export function EditorCanvasElement({
  element,
  viewport,
  selected,
  onSelect,
}: EditorCanvasElementProps) {
  const visible = resolveResponsiveValue(element.visibility, viewport)

  if (!visible) {
    return null
  }

  const position = resolveResponsiveValue(element.position, viewport)
  const size = resolveResponsiveValue(element.size, viewport)
  const label = elementKindLabels[element.kind]
  const style: CSSProperties = {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
  }

  const selectCurrentElement = () => {
    onSelect(element.id)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation()
    selectCurrentElement()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    selectCurrentElement()
  }

  return (
    <div
      className={`canvas-element canvas-element--${element.kind} ${selected ? 'canvas-element--selected' : ''}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Velg ${label.toLowerCase()}`}
      aria-pressed={selected}
      data-element-id={element.id}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    >
      <span className="canvas-element__placeholder" aria-hidden="true">
        {label}
      </span>
    </div>
  )
}
