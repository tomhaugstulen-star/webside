import { expect, test } from '@playwright/test'
import {
  BUTTON_ASSET_IDS,
  createButtonAssetId,
  isKnownButtonAssetId,
} from '../../src/model/buttonAsset'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
} from '../../src/model/headerElement'
import {
  MAX_IMAGE_FILE_BYTES,
  createImageAssetId,
  isValidImageAssetMetadata,
  type ImageAssetMetadata,
} from '../../src/model/imageAsset'
import {
  DEFAULT_TEXT_APPEARANCE,
  isValidTextAppearance,
} from '../../src/model/textAppearance'
import { isValidElementCreationRequest } from '../../src/state/isValidElementCreationRequest'

function createValidImageMetadata(): ImageAssetMetadata {
  return {
    fileName: 'hero.webp',
    mimeType: 'image/webp',
    byteSize: 512_000,
    width: 1_600,
    height: 900,
  }
}

test.describe('model validators', () => {
  test('validates image metadata at the documented resource boundaries', () => {
    expect(
      isValidImageAssetMetadata({
        ...createValidImageMetadata(),
        byteSize: MAX_IMAGE_FILE_BYTES,
        width: 8_000,
        height: 5_000,
      }),
    ).toBe(true)

    expect(
      isValidImageAssetMetadata({
        ...createValidImageMetadata(),
        byteSize: MAX_IMAGE_FILE_BYTES + 1,
      }),
    ).toBe(false)

    expect(
      isValidImageAssetMetadata({
        ...createValidImageMetadata(),
        width: 8_001,
        height: 5_000,
      }),
    ).toBe(false)

    expect(
      isValidImageAssetMetadata({
        ...createValidImageMetadata(),
        mimeType: 'image/gif',
      }),
    ).toBe(false)
  })

  test('requires normalized header text', () => {
    expect(isValidHeaderSiteName('Nordlys Studio')).toBe(true)
    expect(isValidHeaderSiteName(' Nordlys Studio ')).toBe(false)
    expect(isValidHeaderSiteName('')).toBe(false)
    expect(isValidHeaderSubtitle('')).toBe(true)
    expect(isValidHeaderSubtitle('Digitalt  håndverk')).toBe(false)
  })

  test('validates the exact text appearance shape', () => {
    expect(DEFAULT_TEXT_APPEARANCE.backgroundColor).toBe('#FFFFFF')
    expect(isValidTextAppearance(DEFAULT_TEXT_APPEARANCE)).toBe(true)
    expect(isValidTextAppearance({ backgroundColor: '#ffffff' })).toBe(false)
    expect(isValidTextAppearance({ backgroundColor: '#FFFFFF', extra: true })).toBe(
      false,
    )
    expect(isValidTextAppearance(null)).toBe(false)
  })

  test('distinguishes stable known button IDs from arbitrary valid IDs', () => {
    expect(isKnownButtonAssetId(BUTTON_ASSET_IDS.primaryRounded)).toBe(true)
    expect(
      isKnownButtonAssetId(createButtonAssetId('button.unknown-rounded.v1')),
    ).toBe(false)
    expect(isKnownButtonAssetId('invalid button id')).toBe(false)
  })

  test('validates image, button and header creation requests', () => {
    const imageAssetId = createImageAssetId()
    const imageMetadata = createValidImageMetadata()

    expect(
      isValidElementCreationRequest({
        kind: 'image',
        assetId: imageAssetId,
        assetMetadata: imageMetadata,
      }),
    ).toBe(true)

    expect(
      isValidElementCreationRequest({
        kind: 'image',
        assetId: imageAssetId,
        assetMetadata: { ...imageMetadata, byteSize: 0 },
      }),
    ).toBe(false)

    expect(
      isValidElementCreationRequest({
        kind: 'button',
        assetId: BUTTON_ASSET_IDS.outlineRounded,
      }),
    ).toBe(true)

    expect(
      isValidElementCreationRequest({
        kind: 'button',
        assetId: createButtonAssetId('button.unknown-rounded.v1'),
      }),
    ).toBe(false)

    expect(
      isValidElementCreationRequest({
        kind: 'header',
        logoAssetId: imageAssetId,
        logoAssetMetadata: imageMetadata,
        siteName: 'Nordlys Studio',
        subtitle: 'Digitalt håndverk',
      }),
    ).toBe(true)

    expect(
      isValidElementCreationRequest({
        kind: 'header',
        logoAssetId: imageAssetId,
        logoAssetMetadata: imageMetadata,
        siteName: ' Nordlys Studio ',
        subtitle: 'Digitalt håndverk',
      }),
    ).toBe(false)
  })
})
