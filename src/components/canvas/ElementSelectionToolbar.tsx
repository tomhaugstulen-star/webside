import type { CSSProperties, PointerEvent } from 'react'
import { HeaderAiControls } from '../../ai/HeaderAiControls'
import type { ElementLayout } from '../../model/elementLayout'
import type { EditorElement, ResponsiveViewport } from '../../model/editorProject'
import { useElementLocking } from '../../state/useElementLocking'

type ElementSelectionToolbarProps = {
  element: EditorElement
  viewport: ResponsiveViewport
  lockable: boolean
  locked: boolean
  layout: ElementLayout
  onOpenProperties: () => void
}

function LockIcon({ locked }: { locked: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      {locked ? (
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      ) : (
        <path d="M16 10V7a4 4 0 0 0-7.7-1.5" />
      )}
      <path d="M12 14v2" />
    </svg>
  )
}

export function ElementSelectionToolbar({
  element,
  viewport,
  lockable,
  locked,
  layout,
  onOpenProperties,
}: ElementSelectionToolbarProps) {
  const { toggleElementLocked } = useElementLocking()
  const style: CSSProperties = {
    left: element.kind === 'header'
      ? layout.position.x
      : layout.position.x + layout.size.width,
    top: layout.position.y,
  }

  const stopPointerPropagation = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div
      className={`canvas-object-toolbar${element.kind === 'header' ? ' canvas-object-toolbar--header' : ''}`}
      style={style}
      role="toolbar"
      aria-label="Objektverktøy"
      onPointerDown={stopPointerPropagation}
    >
      <button
        className="canvas-object-toolbar__button canvas-object-toolbar__button--label"
        type="button"
        onClick={onOpenProperties}
      >
        Egenskaper
      </button>
      {element.kind === 'header' && (
        <HeaderAiControls element={element} viewport={viewport} layout={layout} />
      )}
      {lockable && (
        <button
          className={`canvas-object-toolbar__button ${locked ? 'canvas-object-toolbar__button--active' : ''}`}
          type="button"
          aria-label={locked ? 'Lås opp element' : 'Lås element'}
          aria-pressed={locked}
          title={locked ? 'Lås opp' : 'Lås'}
          onClick={() => toggleElementLocked(element.id)}
        >
          <LockIcon locked={locked} />
        </button>
      )}
    </div>
  )
}
