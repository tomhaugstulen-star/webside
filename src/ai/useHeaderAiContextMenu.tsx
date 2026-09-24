import { useState, type MouseEvent } from 'react'
import type { ElementLayout } from '../model/elementLayout'
import type { EditorElement, ResponsiveViewport } from '../model/editorProject'
import { HeaderAiControls } from './HeaderAiControls'

type MenuPosition = { x: number; y: number }

export function useHeaderAiContextMenu(
  element: EditorElement,
  viewport: ResponsiveViewport,
  layout: ElementLayout,
  onSelect: (elementId: string) => void,
) {
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (element.kind !== 'header') return
    event.preventDefault()
    event.stopPropagation()
    onSelect(element.id)
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }

  const controls =
    element.kind === 'header' ? (
      <HeaderAiControls
        element={element}
        viewport={viewport}
        layout={layout}
        menuPosition={menuPosition}
        onCloseMenu={() => setMenuPosition(null)}
      />
    ) : null

  return { handleContextMenu, controls }
}
