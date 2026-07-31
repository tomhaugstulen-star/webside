import { expect, test } from '@playwright/test'
import {
  isValidElementLayout,
  moveElementLayout,
  resizeElementLayout,
  type ElementLayout,
} from '../../src/model/elementLayout'

const textLayout: ElementLayout = {
  position: { x: 20, y: 30 },
  size: { width: 240, height: 96 },
}

test.describe('element layout', () => {
  test('clamps movement to the canvas and non-negative y positions', () => {
    expect(
      moveElementLayout(
        {
          position: { x: 80, y: 10 },
          size: { width: 40, height: 20 },
        },
        { x: 50, y: -30 },
        100,
      ),
    ).toEqual({
      position: { x: 60, y: 0 },
      size: { width: 40, height: 20 },
    })
  })

  test('clamps east and north resize to canvas and minimum size', () => {
    expect(
      resizeElementLayout(
        'text',
        textLayout,
        { x: 200, y: 0 },
        300,
        'east',
      ),
    ).toEqual({
      position: { x: 20, y: 30 },
      size: { width: 280, height: 96 },
    })

    expect(
      resizeElementLayout(
        'text',
        textLayout,
        { x: -500, y: 0 },
        300,
        'east',
      ),
    ).toEqual({
      position: { x: 20, y: 30 },
      size: { width: 120, height: 96 },
    })

    expect(
      resizeElementLayout(
        'text',
        textLayout,
        { x: 0, y: 100 },
        300,
        'north',
      ),
    ).toEqual({
      position: { x: 20, y: 78 },
      size: { width: 240, height: 48 },
    })
  })

  test('applies the configured maximum header height', () => {
    expect(
      resizeElementLayout(
        'header',
        {
          position: { x: 0, y: 0 },
          size: { width: 960, height: 88 },
        },
        { x: 0, y: 100 },
        960,
        'south',
      ),
    ).toEqual({
      position: { x: 0, y: 0 },
      size: { width: 960, height: 100 },
    })
  })

  test('rejects non-finite, negative and undersized layouts', () => {
    expect(isValidElementLayout('text', textLayout)).toBe(true)
    expect(
      isValidElementLayout('text', {
        ...textLayout,
        position: { x: -1, y: 30 },
      }),
    ).toBe(false)
    expect(
      isValidElementLayout('text', {
        ...textLayout,
        size: { width: 119, height: 96 },
      }),
    ).toBe(false)
    expect(
      isValidElementLayout('text', {
        ...textLayout,
        size: { width: Number.NaN, height: 96 },
      }),
    ).toBe(false)
  })
})
