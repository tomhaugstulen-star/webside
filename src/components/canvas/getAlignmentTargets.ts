import type { ElementLayout } from '../../model/elementLayout'
import type {
  EditorElement,
  ResponsiveViewport,
} from '../../model/editorProject'
import { resolveResponsiveValue } from '../../model/resolveResponsiveValue'
import type {
  AlignmentAnchor,
  AlignmentTarget,
  AlignmentTargets,
} from './alignmentGuideTypes'

type GetAlignmentTargetsOptions = {
  elements: EditorElement[]
  activeElementId: string
  viewport: ResponsiveViewport
  canvasWidth: number
  canvasHeight: number
}

const ANCHORS: AlignmentAnchor[] = ['start', 'center', 'end']

function getAnchorCoordinate(start: number, size: number, anchor: AlignmentAnchor) {
  if (anchor === 'start') return start
  if (anchor === 'center') return start + size / 2
  return start + size
}

function getResolvedLayout(
  element: EditorElement,
  viewport: ResponsiveViewport,
  canvasWidth: number,
): ElementLayout {
  const position = resolveResponsiveValue(element.position, viewport)
  const size = resolveResponsiveValue(element.size, viewport)

  if (element.kind === 'header') {
    return {
      position: { x: 0, y: position.y },
      size: { width: canvasWidth, height: size.height },
    }
  }

  return { position, size }
}

function addElementTargets(
  targets: AlignmentTargets,
  elementId: string,
  layout: ElementLayout,
) {
  ANCHORS.forEach((anchor) => {
    targets.x.push({
      axis: 'x',
      anchor,
      coordinate: getAnchorCoordinate(
        layout.position.x,
        layout.size.width,
        anchor,
      ),
      start: layout.position.y,
      end: layout.position.y + layout.size.height,
      source: 'element',
      targetElementId: elementId,
    })
    targets.y.push({
      axis: 'y',
      anchor,
      coordinate: getAnchorCoordinate(
        layout.position.y,
        layout.size.height,
        anchor,
      ),
      start: layout.position.x,
      end: layout.position.x + layout.size.width,
      source: 'element',
      targetElementId: elementId,
    })
  })
}

function getCanvasCenterTargets(
  canvasWidth: number,
  canvasHeight: number,
): AlignmentTarget[] {
  return [
    {
      axis: 'x',
      anchor: 'center',
      coordinate: canvasWidth / 2,
      start: 0,
      end: canvasHeight,
      source: 'canvas',
    },
    {
      axis: 'y',
      anchor: 'center',
      coordinate: canvasHeight / 2,
      start: 0,
      end: canvasWidth,
      source: 'canvas',
    },
  ]
}

export function getAlignmentTargets({
  elements,
  activeElementId,
  viewport,
  canvasWidth,
  canvasHeight,
}: GetAlignmentTargetsOptions): AlignmentTargets {
  const targets: AlignmentTargets = { x: [], y: [] }

  elements.forEach((element) => {
    if (
      element.id === activeElementId ||
      !resolveResponsiveValue(element.visibility, viewport)
    ) {
      return
    }

    addElementTargets(
      targets,
      element.id,
      getResolvedLayout(element, viewport, canvasWidth),
    )
  })

  getCanvasCenterTargets(canvasWidth, canvasHeight).forEach((target) => {
    targets[target.axis].push(target)
  })

  return targets
}
