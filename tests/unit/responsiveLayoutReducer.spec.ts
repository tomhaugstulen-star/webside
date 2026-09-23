import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createImageAssetId } from '../../src/model/imageAsset'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from '../../src/state/editorProjectReducer'

const FIRST_AT = '2026-09-23T12:40:00.000Z'
const SECOND_AT = '2026-09-23T12:41:00.000Z'

const metadata = {
  fileName: 'image.png',
  mimeType: 'image/png' as const,
  byteSize: 100,
  width: 1200,
  height: 800,
}

function addHero() {
  const initial = getInitialEditorProjectState()
  return editorProjectReducer(initial, {
    type: 'add-element-to-active-page',
    elementId: 'hero-1',
    request: {
      kind: 'hero',
      imageAssetId: createImageAssetId(),
      imageAssetMetadata: metadata,
    },
    updatedAt: FIRST_AT,
  })
}

test('mobile layout creates an override without changing desktop layout', () => {
  const state = addHero()
  const heroBefore = state.project.pages[0].elements[0]
  if (!heroBefore || heroBefore.kind !== 'hero') throw new Error('Expected Hero.')

  const mobileLayout = {
    position: { x: 12, y: 140 },
    size: { width: 360, height: 190 },
  }
  const updated = editorProjectReducer(state, {
    type: 'set-element-viewport-layout',
    elementId: 'hero-1',
    viewport: 'mobile',
    layout: mobileLayout,
    updatedAt: SECOND_AT,
  })

  const hero = updated.project.pages[0].elements[0]
  if (!hero || hero.kind !== 'hero') throw new Error('Expected Hero.')

  expect(hero.position.desktop).toEqual(heroBefore.position.desktop)
  expect(hero.size.desktop).toEqual(heroBefore.size.desktop)
  expect(hero.position.mobile).toEqual(mobileLayout.position)
  expect(hero.size.mobile).toEqual(mobileLayout.size)
  expect(updated.project.updatedAt).toBe(SECOND_AT)
})

test('desktop changes preserve an existing mobile override', () => {
  const state = addHero()
  const withMobile = editorProjectReducer(state, {
    type: 'set-element-viewport-layout',
    elementId: 'hero-1',
    viewport: 'mobile',
    layout: {
      position: { x: 10, y: 110 },
      size: { width: 350, height: 180 },
    },
    updatedAt: SECOND_AT,
  })
  const desktopChanged = editorProjectReducer(withMobile, {
    type: 'set-element-viewport-layout',
    elementId: 'hero-1',
    viewport: 'desktop',
    layout: {
      position: { x: 40, y: 150 },
      size: { width: 700, height: 360 },
    },
    updatedAt: SECOND_AT,
  })

  const hero = desktopChanged.project.pages[0].elements[0]
  if (!hero || hero.kind !== 'hero') throw new Error('Expected Hero.')

  expect(hero.position.desktop).toEqual({ x: 40, y: 150 })
  expect(hero.size.desktop).toEqual({ width: 700, height: 360 })
  expect(hero.position.mobile).toEqual({ x: 10, y: 110 })
  expect(hero.size.mobile).toEqual({ width: 350, height: 180 })
})

test('mobile crop frame does not rewrite shared crop transform or desktop frame', () => {
  const initial = getInitialEditorProjectState()
  const withImage = editorProjectReducer(initial, {
    type: 'add-element-to-active-page',
    elementId: 'image-1',
    request: {
      kind: 'image',
      assetId: createImageAssetId(),
      assetMetadata: metadata,
    },
    updatedAt: FIRST_AT,
  })
  const crop = editorProjectReducer(withImage, {
    type: 'set-image-mode',
    elementId: 'image-1',
    mode: 'crop',
    updatedAt: FIRST_AT,
  })
  const before = crop.project.pages[0].elements[0]
  if (!before || before.kind !== 'image') throw new Error('Expected image.')

  const updated = editorProjectReducer(crop, {
    type: 'set-image-viewport-frame',
    elementId: 'image-1',
    viewport: 'mobile',
    layout: {
      position: { x: 20, y: 100 },
      size: { width: 200, height: 120 },
    },
    transform: { zoom: 2, offsetX: 0.5, offsetY: -0.5 },
    updatedAt: SECOND_AT,
  })

  const image = updated.project.pages[0].elements[0]
  if (!image || image.kind !== 'image') throw new Error('Expected image.')

  expect(image.position.desktop).toEqual(before.position.desktop)
  expect(image.size.desktop).toEqual(before.size.desktop)
  expect(image.position.mobile).toEqual({ x: 20, y: 100 })
  expect(image.size.mobile).toEqual({ width: 200, height: 120 })
  expect(image.transform).toEqual(before.transform)
})
