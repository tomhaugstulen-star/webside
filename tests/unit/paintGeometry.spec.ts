import { expect, test } from '@playwright/test'
import { movedSelectionPosition } from '../../src/paint/paintDrawing'
import { fitSelection, selectionBetween, validDimensions } from '../../src/paint/paintGeometry'

test('selection coordinates normalize reverse drags and stay within the image', () => {
  const dragged = selectionBetween({ x: 90, y: 80 }, { x: 10, y: 20 })
  expect(dragged).toEqual({ x: 10, y: 20, width: 80, height: 60 })
  expect(fitSelection(dragged, 70, 50)).toEqual({
    x: 10, y: 20, width: 60, height: 30,
  })
  expect(movedSelectionPosition(dragged, { x: 20, y: 30 },
    { x: 500, y: 500 }, 160, 120)).toEqual({ x: 80, y: 60 })
})

test('resize rejects invalid dimensions and pixel counts', () => {
  expect(validDimensions(1920, 1080)).toBe(true)
  expect(validDimensions(0, 1080)).toBe(false)
  expect(validDimensions(16385, 1)).toBe(false)
  expect(validDimensions(8000, 6000)).toBe(false)
})
