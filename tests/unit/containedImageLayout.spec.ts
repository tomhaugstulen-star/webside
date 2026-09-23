import { expect, test } from '@playwright/test'
import {
  normalizeContainedImageLayout,
  resizeContainedImageLayout,
} from '../../src/model/containedImageLayout'

const portrait = {
  fileName: 'portrait.png',
  mimeType: 'image/png' as const,
  byteSize: 100,
  width: 1000,
  height: 1600,
}

const landscape = {
  fileName: 'landscape.png',
  mimeType: 'image/png' as const,
  byteSize: 100,
  width: 1600,
  height: 1000,
}

test('Hele bildet removes empty frame space and keeps handles at the visible image', () => {
  expect(
    normalizeContainedImageLayout(
      portrait,
      {
        position: { x: 20, y: 30 },
        size: { width: 240, height: 160 },
      },
      960,
    ),
  ).toEqual({
    position: { x: 90, y: 30 },
    size: { width: 100, height: 160 },
  })

  expect(
    normalizeContainedImageLayout(
      landscape,
      {
        position: { x: 20, y: 30 },
        size: { width: 240, height: 160 },
      },
      960,
    ),
  ).toEqual({
    position: { x: 20, y: 35 },
    size: { width: 240, height: 150 },
  })
})

test('Hele bildet resizes proportionally and stops at the canvas boundary', () => {
  const initial = {
    position: { x: 90, y: 30 },
    size: { width: 100, height: 160 },
  }

  const expanded = resizeContainedImageLayout(
    portrait,
    initial,
    { x: 1000, y: 0 },
    390,
    'east',
  )

  expect(expanded.position).toEqual({ x: 90, y: 30 })
  expect(expanded.size.width).toBe(300)
  expect(expanded.size.height).toBe(480)
  expect(expanded.size.width / expanded.size.height).toBeCloseTo(
    portrait.width / portrait.height,
  )
})

test('Hele bildet uses the same minimum short side for portrait and landscape', () => {
  const portraitResult = resizeContainedImageLayout(
    portrait,
    {
      position: { x: 100, y: 100 },
      size: { width: 100, height: 160 },
    },
    { x: -1000, y: 0 },
    960,
    'east',
  )
  const landscapeResult = resizeContainedImageLayout(
    landscape,
    {
      position: { x: 100, y: 100 },
      size: { width: 160, height: 100 },
    },
    { x: -1000, y: 0 },
    960,
    'east',
  )

  expect(Math.min(portraitResult.size.width, portraitResult.size.height)).toBe(48)
  expect(Math.min(landscapeResult.size.width, landscapeResult.size.height)).toBe(48)
  expect(portraitResult.size.width / portraitResult.size.height).toBeCloseTo(
    portrait.width / portrait.height,
  )
  expect(landscapeResult.size.width / landscapeResult.size.height).toBeCloseTo(
    landscape.width / landscape.height,
  )
})
