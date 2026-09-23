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

test('validates exact solid and two-stop linear gradient fills', () => {
  const white = createEditorColor('#FFFFFF')
  const black = createEditorColor('#000000')

  expect(isEditorFill(createSolidFill(white))).toBe(true)
  expect(isEditorFill(createLinearGradientFill(white, black, 135))).toBe(true)
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
    stops: ['#FFFFFF', '#000000', '#123456'],
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
    stops: ['#123456', '#123456'],
  })
  expect(toSolidFill(gradient)).toEqual({
    type: 'solid',
    color: '#123456',
  })
})

test('renders typed fills to deterministic CSS values', () => {
  const white = createEditorColor('#FFFFFF')
  const black = createEditorColor('#000000')

  expect(editorFillToCssBackground(createSolidFill(white))).toBe('#FFFFFF')
  expect(
    editorFillToCssBackground(createLinearGradientFill(white, black, 45)),
  ).toBe('linear-gradient(45deg, #FFFFFF 0%, #000000 100%)')
})
