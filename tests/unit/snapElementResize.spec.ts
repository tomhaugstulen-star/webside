import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import type { ElementLayout, ResizeHandle } from '../../src/model/elementLayout'
import { snapElementResize } from '../../src/components/canvas/snapElementResize'
import type { ResizeSizeTarget } from '../../src/components/canvas/resizeSizeTargets'

const element = createEditorElement({
  id: 'active', request: { kind: 'text' }, existingElements: [],
})
const layout: ElementLayout = {
  position: { x: 100, y: 50 }, size: { width: 240, height: 96 },
}
function target(id = 'target', width = 244, height = 100): ResizeSizeTarget {
  return { elementId: id, layout: { position: { x: 400, y: 200 }, size: { width, height } } }
}
function snap(handle: ResizeHandle, targets = [target()], input = layout, canvasWidth = 1000) {
  return snapElementResize({ element, layout: input, handle, targets, canvasWidth })
}

for (const [handle, position, size, axis, coordinates] of [
  ['east', { x: 100, y: 50 }, { width: 244, height: 96 }, 'x', [100, 344]],
  ['west', { x: 96, y: 50 }, { width: 244, height: 96 }, 'x', [96, 340]],
  ['south', { x: 100, y: 50 }, { width: 240, height: 100 }, 'y', [50, 150]],
  ['north', { x: 100, y: 46 }, { width: 240, height: 100 }, 'y', [46, 146]],
] as const) {
  test(`${handle} snaps only its dimension, preserves the opposite edge and gives two guides`, () => {
    const result = snap(handle)
    expect(result.layout).toEqual({ position, size })
    expect(result.guides).toHaveLength(2)
    expect(result.guides.map((guide) => guide.coordinate)).toEqual(coordinates)
    for (const guide of result.guides) {
      expect(guide).toMatchObject({ axis, source: 'element', targetElementId: 'target' })
      expect(guide.start).toBe(axis === 'x' ? position.y : position.x)
      expect(guide.end).toBe(axis === 'x' ? 300 : 644)
    }
  })
}

test('snaps both dimensions with four guides at the final edges', () => {
  const result = snap('north-west')
  expect(result.layout).toEqual({ position: { x: 96, y: 46 }, size: { width: 244, height: 100 } })
  expect(result.guides.map(({ axis, coordinate }) => ({ axis, coordinate }))).toEqual([
    { axis: 'x', coordinate: 96 }, { axis: 'x', coordinate: 340 },
    { axis: 'y', coordinate: 46 }, { axis: 'y', coordinate: 146 },
  ])
})

test('does not snap outside the threshold or without targets', () => {
  expect(snap('south-east', [target('far', 247, 103)])).toEqual({ layout, guides: [] })
  expect(snap('south-east', [])).toEqual({ layout, guides: [] })
  expect(snapElementResize({ element, layout, handle: 'east', targets: [target()], canvasWidth: 1000, threshold: 3 }))
    .toEqual({ layout, guides: [] })
  expect(snapElementResize({ element, layout, handle: 'east', targets: [target()], canvasWidth: 1000, threshold: 4 }).layout.size.width)
    .toBe(244)
})

for (const [name, handle, input, reference, canvasWidth] of [
  ['right canvas boundary', 'east', layout, target(), 342],
  ['negative left', 'west', { ...layout, position: { x: 0, y: 50 } }, target(), 1000],
  ['negative top', 'north', { ...layout, position: { x: 100, y: 0 } }, target(), 1000],
  ['minimum width', 'east', { ...layout, size: { width: 120, height: 96 } }, target('small', 118), 1000],
  ['minimum height', 'south', { ...layout, size: { width: 240, height: 48 } }, target('small', 240, 46), 1000],
] as const) {
  test(`rejects snap violating ${name} without showing guides`, () => {
    expect(snap(handle, [reference], input, canvasWidth)).toEqual({ layout: input, guides: [] })
  })
}

test('keeps a valid height snap when the width snap exceeds the canvas', () => {
  const result = snap('south-east', [target()], layout, 342)
  expect(result.layout.size).toEqual({ width: 240, height: 100 })
  expect(result.guides.map((guide) => guide.axis)).toEqual(['y', 'y'])
})

test('chooses by size distance, then cross-axis proximity, then ID regardless of input order', () => {
  const near = target('z-near', 242)
  near.layout.position.y = 50
  const nearerSize = target('z-closest-size', 241)
  const alphabetical = { ...near, elementId: 'a-near' }
  for (const [targets, expected] of [
    [[near, nearerSize], 'z-closest-size'],
    [[target('a-far', 242), near], 'z-near'],
    [[near, alphabetical], 'a-near'],
  ] as const) {
    for (const ordered of [[...targets], [...targets].reverse()]) {
      expect(snap('east', ordered).guides.map((guide) => guide.targetElementId)).toEqual([expected, expected])
    }
  }
})
