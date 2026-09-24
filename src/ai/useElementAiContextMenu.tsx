import { useState, type MouseEvent } from 'react'
import type { ElementLayout } from '../model/elementLayout'
import type { EditorElement } from '../model/editorProject'
import { ElementAiContextPanel } from './ElementAiContextPanel'

type MenuPosition = { x: number; y: number }

export function useElementAiContextMenu(
  element: EditorElement,
  layout: ElementLayout,
  onSelect: (elementId: string) => void,
) {
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onSelect(element.id)
    setPosition({ x: event.clientX, y: event.clientY })
  }

  const panel = position ? (
    <ElementAiContextPanel
      element={element}
      layout={layout}
      position={position}
      onClose={() => setPosition(null)}
    />
  ) : null

  return { handleContextMenu, panel }
}
