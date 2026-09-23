import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createImageAssetId } from '../../src/model/imageAsset'
import { getResizeSizeTargets } from '../../src/components/canvas/resizeSizeTargets'

function text(id: string) {
  return createEditorElement({ id, request: { kind: 'text' }, existingElements: [] })
}

test('excludes active and hidden elements but includes a visible locked target', () => {
  const active = text('active')
  const hidden = { ...text('hidden'), visibility: { desktop: false } }
  const locked = { ...text('locked'), locked: true }
  expect(getResizeSizeTargets({
    elements: [active, hidden, locked], activeElementId: active.id,
    viewport: 'desktop', canvasWidth: 1000,
  })).toEqual([{
    elementId: locked.id,
    layout: { position: locked.position.desktop, size: locked.size.desktop },
  }])
})

test('resolves mobile visibility and applies responsive inherited layout', () => {
  const mobile = {
    ...text('mobile'), visibility: { desktop: false, mobile: true },
    position: { desktop: { x: 100, y: 100 }, mobile: { x: 10, y: 20 } },
    size: { desktop: { width: 240, height: 96 }, mobile: { width: 180, height: 70 } },
  }
  const hidden = { ...text('hidden'), visibility: { desktop: true, mobile: false } }
  const inherited = text('inherited')
  expect(getResizeSizeTargets({
    elements: [mobile, hidden, inherited], activeElementId: 'active',
    viewport: 'mobile', canvasWidth: 390,
  })).toEqual([
    { elementId: 'mobile', layout: { position: mobile.position.mobile, size: mobile.size.mobile } },
    {
      elementId: 'inherited',
      layout: {
        position: { x: 5, y: inherited.position.desktop.y },
        size: inherited.size.desktop,
      },
    },
  ])
})

for (const [viewport, canvasWidth] of [['desktop', 1000], ['mobile', 390]] as const) {
  test(`Header target uses actual ${viewport} canvas width and origin`, () => {
    const header = createEditorElement({
      id: 'header', existingElements: [], request: {
        kind: 'header', siteName: 'Test', subtitle: '', logoAssetId: createImageAssetId(),
        logoAssetMetadata: { fileName: 'logo.png', mimeType: 'image/png', byteSize: 100, width: 10, height: 10 },
      },
    })
    expect(getResizeSizeTargets({ elements: [header], activeElementId: 'active', viewport, canvasWidth }))
      .toEqual([{ elementId: 'header', layout: { position: { x: 0, y: 0 }, size: { width: canvasWidth, height: 88 } } }])
  })
}
