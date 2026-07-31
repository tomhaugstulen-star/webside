import { expect, test } from '@playwright/test'
import type { ElementLayout } from '../../src/model/elementLayout'
import type {
  AlignmentTarget,
  AlignmentTargets,
} from '../../src/components/canvas/alignmentGuideTypes'
import { snapElementMove } from '../../src/components/canvas/snapElementMove'

function target(
  overrides: Partial<AlignmentTarget> &
    Pick<AlignmentTarget, 'axis' | 'anchor' | 'coordinate'>,
): AlignmentTarget {
  return {
    start: 0,
    end: 200,
    source: 'element',
    targetElementId: 'target-1',
    ...overrides,
  }
}

const emptyTargets: AlignmentTargets = { x: [], y: [] }

const layout: ElementLayout = {
  position: { x: 100, y: 50 },
  size: { width: 100, height: 50 },
}

test.describe('alignment snapping', () => {
  test('snaps independently on both axes and returns active guides', () => {
    const result = snapElementMove({
      layout,
      canvasWidth: 500,
      targets: {
        x: [target({ axis: 'x', anchor: 'start', coordinate: 104 })],
        y: [target({ axis: 'y', anchor: 'start', coordinate: 47 })],
      },
    })

    expect(result.layout.position).toEqual({ x: 104, y: 47 })
    expect(result.guides).toHaveLength(2)
    expect(result.guides.map((guide) => guide.axis)).toEqual(['x', 'y'])
    expect(result.guides.map((guide) => guide.coordinate)).toEqual([104, 47])
  })

  test('does not snap beyond the configured threshold', () => {
    const result = snapElementMove({
      layout,
      canvasWidth: 500,
      targets: {
        ...emptyTargets,
        x: [target({ axis: 'x', anchor: 'start', coordinate: 107 })],
      },
    })

    expect(result.layout).toEqual(layout)
    expect(result.guides).toEqual([])
  })

  test('prefers the active center anchor when distances are equal', () => {
    const result = snapElementMove({
      layout,
      canvasWidth: 500,
      targets: {
        ...emptyTargets,
        x: [
          target({
            axis: 'x',
            anchor: 'start',
            coordinate: 99,
            targetElementId: 'start-target',
          }),
          target({
            axis: 'x',
            anchor: 'center',
            coordinate: 151,
            targetElementId: 'center-target',
          }),
        ],
      },
    })

    expect(result.layout.position.x).toBe(101)
    expect(result.guides[0]).toMatchObject({
      axis: 'x',
      coordinate: 151,
      targetElementId: 'center-target',
    })
  })

  test('rejects a snap that would move the element outside the canvas', () => {
    const edgeLayout: ElementLayout = {
      position: { x: 0, y: 20 },
      size: { width: 100, height: 50 },
    }
    const result = snapElementMove({
      layout: edgeLayout,
      canvasWidth: 500,
      targets: {
        ...emptyTargets,
        x: [target({ axis: 'x', anchor: 'start', coordinate: -5 })],
      },
    })

    expect(result.layout).toEqual(edgeLayout)
    expect(result.guides).toEqual([])
  })
})
