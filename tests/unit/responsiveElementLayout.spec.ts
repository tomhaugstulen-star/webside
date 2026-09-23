import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createImageAssetId } from '../../src/model/imageAsset'
import { resolveResponsiveElementLayout } from '../../src/model/resolveResponsiveElementLayout'

const metadata = {
  fileName: 'hero.png',
  mimeType: 'image/png' as const,
  byteSize: 100,
  width: 1200,
  height: 800,
}

test('fits an inherited wide Hero into the mobile canvas', () => {
  const hero = createEditorElement({
    id: 'hero',
    existingElements: [],
    request: {
      kind: 'hero',
      imageAssetId: createImageAssetId(),
      imageAssetMetadata: metadata,
    },
  })

  hero.position.desktop = { x: 0, y: 120 }
  hero.size.desktop = { width: 900, height: 420 }

  expect(resolveResponsiveElementLayout(hero, 'mobile', 390)).toEqual({
    position: { x: 0, y: 120 },
    size: { width: 390, height: 182 },
  })
  expect(hero.size.mobile).toBeUndefined()
  expect(hero.position.mobile).toBeUndefined()
})

test('keeps smaller inherited elements at their desktop size and maps x proportionally', () => {
  const text = createEditorElement({
    id: 'text',
    existingElements: [],
    request: { kind: 'text' },
  })

  text.position.desktop = { x: 360, y: 200 }

  expect(resolveResponsiveElementLayout(text, 'mobile', 390)).toEqual({
    position: { x: 75, y: 200 },
    size: { width: 240, height: 96 },
  })
})

test('prefers explicit mobile position and size without changing desktop data', () => {
  const hero = createEditorElement({
    id: 'hero',
    existingElements: [],
    request: {
      kind: 'hero',
      imageAssetId: createImageAssetId(),
      imageAssetMetadata: metadata,
    },
  })

  hero.position.desktop = { x: 100, y: 100 }
  hero.size.desktop = { width: 900, height: 420 }
  hero.position.mobile = { x: 12, y: 80 }
  hero.size.mobile = { width: 330, height: 210 }

  expect(resolveResponsiveElementLayout(hero, 'mobile', 390)).toEqual({
    position: { x: 12, y: 80 },
    size: { width: 330, height: 210 },
  })
  expect(resolveResponsiveElementLayout(hero, 'desktop', 960)).toEqual({
    position: { x: 100, y: 100 },
    size: { width: 900, height: 420 },
  })
})

test('Header always follows the active canvas width', () => {
  const header = createEditorElement({
    id: 'header',
    existingElements: [],
    request: {
      kind: 'header',
      siteName: 'Test',
      subtitle: '',
      logoAssetId: createImageAssetId(),
      logoAssetMetadata: metadata,
    },
  })

  expect(resolveResponsiveElementLayout(header, 'mobile', 390)).toEqual({
    position: { x: 0, y: 0 },
    size: { width: 390, height: 88 },
  })
})
