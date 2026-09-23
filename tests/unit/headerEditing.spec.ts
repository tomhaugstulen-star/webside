import { expect, test } from '@playwright/test'
import { createImageAssetId } from '../../src/model/imageAsset'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from '../../src/state/editorProjectReducer'

const CREATED_AT = '2026-09-23T12:00:00.000Z'
const UPDATED_AT = '2026-09-23T12:01:00.000Z'

const metadata = {
  fileName: 'logo.png',
  mimeType: 'image/png' as const,
  byteSize: 68,
  width: 64,
  height: 64,
}

function addHeader() {
  const state = getInitialEditorProjectState()
  const logoAssetId = createImageAssetId()
  const next = editorProjectReducer(state, {
    type: 'add-element-to-active-page',
    elementId: 'header-1',
    request: {
      kind: 'header',
      logoAssetId,
      logoAssetMetadata: metadata,
      siteName: 'Mitt nettsted',
      subtitle: 'En undertittel',
    },
    updatedAt: CREATED_AT,
  })

  return { state: next, logoAssetId }
}

test('updates Header name and subtitle through typed reducer actions', () => {
  const { state } = addHeader()
  const updated = editorProjectReducer(state, {
    type: 'set-header-content',
    elementId: 'header-1',
    siteName: 'Nytt navn',
    subtitle: '',
    updatedAt: UPDATED_AT,
  })

  const header = updated.project.pages[0].elements[0]
  if (!header || header.kind !== 'header') throw new Error('Expected Header.')

  expect(header.siteName).toBe('Nytt navn')
  expect(header.subtitle).toBe('')
  expect(updated.project.updatedAt).toBe(UPDATED_AT)
})

test('replaces Header logo metadata without changing the project schema', () => {
  const { state } = addHeader()
  const nextLogoAssetId = createImageAssetId()
  const nextMetadata = {
    ...metadata,
    fileName: 'new-logo.webp',
    mimeType: 'image/webp' as const,
  }

  const updated = editorProjectReducer(state, {
    type: 'set-header-logo',
    elementId: 'header-1',
    logoAssetId: nextLogoAssetId,
    logoAssetMetadata: nextMetadata,
    updatedAt: UPDATED_AT,
  })

  const header = updated.project.pages[0].elements[0]
  if (!header || header.kind !== 'header') throw new Error('Expected Header.')

  expect(header.logoAssetId).toBe(nextLogoAssetId)
  expect(header.logoAssetMetadata).toEqual(nextMetadata)
  expect(updated.project.schemaVersion).toBe(state.project.schemaVersion)
})

test('rejects invalid Header content and Header edits while locked', () => {
  const { state } = addHeader()

  expect(
    editorProjectReducer(state, {
      type: 'set-header-content',
      elementId: 'header-1',
      siteName: '',
      subtitle: '',
      updatedAt: UPDATED_AT,
    }),
  ).toBe(state)

  const locked = editorProjectReducer(state, {
    type: 'toggle-element-lock',
    elementId: 'header-1',
    updatedAt: UPDATED_AT,
  })

  expect(
    editorProjectReducer(locked, {
      type: 'set-header-content',
      elementId: 'header-1',
      siteName: 'Skal ikke lagres',
      subtitle: '',
      updatedAt: UPDATED_AT,
    }),
  ).toBe(locked)
})
