import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { editorFillToCssBackground } from '../../model/editorFill'
import type { EditorElement } from '../../model/editorProject'
import type { NavigationTarget } from '../../model/navigation'
import { useEditorProject } from '../../state/useEditorProject'
import type { ViewportMode } from '../../types/editor'
import { getCanvasContentHeight } from '../canvas/getCanvasContentHeight'
import { PreviewElement } from './PreviewElement'

function orderElements(elements: EditorElement[]) {
  return [
    ...elements.filter((element) => element.kind === 'section'),
    ...elements.filter((element) => element.kind !== 'section'),
  ]
}

export function PreviewCanvas({ viewport }: { viewport: ViewportMode }) {
  const { state } = useEditorProject()
  const [pageId, setPageId] = useState(state.activePageId)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const pendingTarget = useRef<NavigationTarget | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const page =
    state.project.pages.find((candidate) => candidate.id === pageId) ??
    state.project.pages[0]
  const contentHeight = getCanvasContentHeight(
    page.elements,
    viewport,
    canvasWidth,
    null,
  )
  const pageStyle: CSSProperties = {
    background: editorFillToCssBackground(page.appearance.backgroundFill),
    ...(contentHeight > 0 ? { height: contentHeight } : {}),
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateWidth = () => setCanvasWidth(canvas.clientWidth)
    const observer = new ResizeObserver(updateWidth)
    updateWidth()
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [viewport])

  const scrollToTarget = useCallback((target: NavigationTarget) => {
    if (target.type === 'page') {
      stageRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const targetPage = state.project.pages.find(
      (candidate) => candidate.id === target.pageId,
    )
    const section = targetPage?.elements.find(
      (element) =>
        element.kind === 'section' && element.id === target.elementId,
    )

    if (!section || section.kind !== 'section') return

    requestAnimationFrame(() => {
      document
        .getElementById(section.anchorId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [state.project.pages])

  const navigate = (target: NavigationTarget) => {
    if (target.pageId === page.id) {
      scrollToTarget(target)
      return
    }

    if (!state.project.pages.some((candidate) => candidate.id === target.pageId)) {
      return
    }

    pendingTarget.current = target
    setPageId(target.pageId)
  }

  useLayoutEffect(() => {
    const target = pendingTarget.current
    if (!target || target.pageId !== page.id) return

    pendingTarget.current = null
    scrollToTarget(target)
  }, [page.id, scrollToTarget])

  return (
    <main className="preview-workspace">
      <div className="preview-stage" ref={stageRef}>
        <div
          ref={canvasRef}
          className={`canvas-page canvas-page--${viewport} preview-page preview-page--${viewport}`}
          style={pageStyle}
          aria-label={`Forhåndsvisning: ${page.name}`}
        >
          {orderElements(page.elements).map((element) => (
            <PreviewElement
              key={element.id}
              element={element}
              viewport={viewport}
              canvasWidth={canvasWidth}
              pages={state.project.pages}
              navigation={state.project.navigation}
              activePageId={page.id}
              onNavigate={navigate}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
