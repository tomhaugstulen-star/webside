import { expect, test } from '@playwright/test'
import {
  resizedSelection,
  resizeHandleAtPoint,
} from '../../src/paint/paintSelectionResize'

test('detects corner resize handles', () => {
  const selection = { x: 100, y: 80, width: 200, height: 100 }
  expect(resizeHandleAtPoint(selection, { x: 102, y: 82 }, 8)).toBe('nw')
  expect(resizeHandleAtPoint(selection, { x: 299, y: 179 }, 8)).toBe('se')
  expect(resizeHandleAtPoint(selection, { x: 200, y: 130 }, 8)).toBeNull()
})

test('resizes proportionally from a corner', () => {
  const selection = { x: 100, y: 80, width: 200, height: 100 }
  const resized = resizedSelection(
    selection, 'se', { x: 400, y: 230 }, 800, 600,
  )
  expect(resized).toEqual({ x: 100, y: 80, width: 300, height: 150 })
})

test('keeps resized selection inside the canvas', () => {
  const selection = { x: 100, y: 100, width: 200, height: 100 }
  const resized = resizedSelection(
    selection, 'nw', { x: -100, y: -100 }, 500, 400,
  )
  expect(resized.x).toBeGreaterThanOrEqual(0)
  expect(resized.y).toBeGreaterThanOrEqual(0)
  expect(resized.x + resized.width).toBeLessThanOrEqual(500)
  expect(resized.y + resized.height).toBeLessThanOrEqual(400)
})
