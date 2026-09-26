import { expect, test } from '@playwright/test'
import { createEditorColor } from '../../src/model/editorColor'
import {
  createLinearGradientFill,
  createSolidFill,
  editorFillToCssBackground,
  isEditorFill,
  isEditorGradientAngle,
  toLinearGradientFill,
  toSolidFill,
} from '../../src/model/editorFill'

test('validates solid fills and two- or three-stop linear gradients', () => {
  const white = createEditorColor('#FFFFFF')
  const black = createEditorColor('#000000')
  const yellow = createEditorColor('#FFFF00')

  expect(isEditorFill(createSolidFill(white))).toBe(true)
  expect(isEditorFill(createLinearGradientFill(white, yellow, black, 135))).toBe(true)
  expect(isEditorFill({
    type: 'linear-gradient',
    angle: 90,
    stops: ['#FFFFFF', '#000000'],
  })).toBe(true)
  expect(isEditorFill({ type: 'solid', color: '#ffffff' })).toBe(false)
  expect(isEditorFill({ type: 'solid', color: '#FFFFFF', extra: true })).toBe(false)
  expect(isEditorFill({
    type: 'linear-gradient',
    angle: 90,
    stops: ['#FFFFFF'],
  })).toBe(false)
  expect(isEditorFill({
    type: 'linear-gradient',
    angle: 90,
    stops: ['#FFFFFF', '#000000', '#123456', '#654321'],
  })).toBe(false)
})

test('accepts only finite gradient angles from zero through 360', () => {
  expect(isEditorGradientAngle(0)).toBe(true)
  expect(isEditorGradientAngle(360)).toBe(true)
  expect(isEditorGradientAngle(22.5)).toBe(true)
  expect(isEditorGradientAngle(-1)).toBe(false)
  expect(isEditorGradientAngle(361)).toBe(false)
  expect(isEditorGradientAngle(Number.NaN)).toBe(false)
  expect(isEditorGradientAngle(Number.POSITIVE_INFINITY)).toBe(false)
  expect(isEditorGradientAngle('90')).toBe(false)
})

test('converts fills deterministically without losing the primary color', () => {
  const solid = createSolidFill(createEditorColor('#123456'))
  const gradient = toLinearGradientFill(solid)

  expect(gradient).toEqual({
    type: 'linear-gradient',
    angle: 90,
    stops: ['#123456', '#123456', '#123456'],
  })
  expect(toSolidFill(gradient)).toEqual({
    type: 'solid',
    color: '#123456',
  })
})

test('upgrades legacy two-stop gradients when opened for editing', () => {
  const legacy = {
    type: 'linear-gradient' as const,
    angle: 180,
    stops: [
      createEditorColor('#000000'),
      createEditorColor('#008000'),
    ] as [ReturnType<typeof createEditorColor>, ReturnType<typeof createEditorColor>],
  }

  expect(toLinearGradientFill(legacy)).toEqual({
    type: 'linear-gradient',
    angle: 180,
    stops: ['#000000', '#008000', '#008000'],
  })
})

test('renders typed fills to deterministic CSS values', () => {
  const white = createEditorColor('#FFFFFF')
  const yellow = createEditorColor('#FFFF00')
  const black = createEditorColor('#000000')

  expect(editorFillToCssBackground(createSolidFill(white))).toBe('#FFFFFF')
  expect(
    editorFillToCssBackground(createLinearGradientFill(white, yellow, black, 45)),
  ).toBe('linear-gradient(45deg, #FFFFFF 0%, #FFFF00 50%, #000000 100%)')
})
