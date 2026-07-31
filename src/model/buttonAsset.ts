const BUTTON_ASSET_ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/
const MAX_BUTTON_ASSET_ID_LENGTH = 120

declare const buttonAssetIdBrand: unique symbol

export type ButtonAssetId = string & {
  readonly [buttonAssetIdBrand]: true
}

export const DEFAULT_BUTTON_LABEL = 'Les mer'

export function normalizeButtonLabel(value: string): string | null {
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

export function isButtonAssetId(value: unknown): value is ButtonAssetId {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_BUTTON_ASSET_ID_LENGTH &&
    BUTTON_ASSET_ID_PATTERN.test(value)
  )
}

export function createButtonAssetId(value: string): ButtonAssetId {
  if (!isButtonAssetId(value)) {
    throw new Error(`Invalid button asset ID: ${value}`)
  }

  return value
}

export const BUTTON_ASSET_IDS = {
  primaryRounded: createButtonAssetId('button.primary-rounded.v1'),
  secondaryRounded: createButtonAssetId('button.secondary-rounded.v1'),
  outlineRounded: createButtonAssetId('button.outline-rounded.v1'),
  darkRounded: createButtonAssetId('button.dark-rounded.v1'),
} as const satisfies Record<string, ButtonAssetId>

const knownButtonAssetIds = Object.values(BUTTON_ASSET_IDS)

export function isKnownButtonAssetId(value: unknown): value is ButtonAssetId {
  return (
    isButtonAssetId(value) &&
    knownButtonAssetIds.some((assetId) => assetId === value)
  )
}

export const DEFAULT_BUTTON_ASSET_ID = BUTTON_ASSET_IDS.primaryRounded
