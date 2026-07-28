import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import type { EditorElement, ResponsiveValue } from '../../model/editorProject'
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

function resolveResponsiveValue<T>(value: ResponsiveValue<T>, viewport: ViewportMode) {
  if (viewport === 'mobile') {
    return value.mobile ?? value.desktop
  }

  return value.desktop
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
      className={`canvas-element ${selected ? 'canvas-element--selected' : ''}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Velg ${elementKindLabels[element.kind].toLowerCase()}`}
      aria-pressed={selected}
      data-element-id={element.id}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    />
  )
}
