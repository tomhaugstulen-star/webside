import type { ResponsiveValue } from '../model/editorProject'

export const STABLE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
) {
  const keys = Object.keys(value)
  return (
    keys.length === expectedKeys.length &&
    keys.every((key) => expectedKeys.includes(key))
  )
}

export function isStableId(value: unknown): value is string {
  return typeof value === 'string' && STABLE_ID_PATTERN.test(value)
}

export function isIsoTimestamp(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  )
}

function isFiniteNonNegativeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export function isValidPosition(value: unknown) {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['x', 'y']) &&
    isFiniteNonNegativeNumber(value.x) &&
    isFiniteNonNegativeNumber(value.y)
  )
}

export function isValidSize(value: unknown) {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['width', 'height']) &&
    typeof value.width === 'number' &&
    Number.isFinite(value.width) &&
    value.width > 0 &&
    typeof value.height === 'number' &&
    Number.isFinite(value.height) &&
    value.height > 0
  )
}

export function isValidResponsiveValue<T>(
  value: unknown,
  validator: (candidate: unknown) => candidate is T,
): value is ResponsiveValue<T> {
  if (!isRecord(value)) {
    return false
  }

  const keys = Object.keys(value)
  if (
    !(
      (keys.length === 1 && keys[0] === 'desktop') ||
      (keys.length === 2 &&
        keys.includes('desktop') &&
        keys.includes('mobile'))
    )
  ) {
    return false
  }

  return (
    validator(value.desktop) &&
    (!Object.hasOwn(value, 'mobile') || validator(value.mobile))
  )
}
