import { expect, test } from '@playwright/test'
import { createImageAssetId } from '../../src/model/imageAsset'
import { createLocalProjectSnapshot } from '../../src/persistence/createLocalProjectSnapshot'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from '../../src/state/editorProjectReducer'

test('creates a local snapshot only when every referenced asset is available', () => {
  const assetId = createImageAssetId()
  const file = new File([new Uint8Array([1])], 'pixel.png', {
    type: 'image/png',
  })
  const metadata = {
    fileName: file.name,
    mimeType: 'image/png' as const,
    byteSize: file.size,
    width: 1,
    height: 1,
  }
  const state = editorProjectReducer(getInitialEditorProjectState(), {
    type: 'add-element-to-active-page',
    elementId: 'image-1',
    request: {
      kind: 'image',
      assetId,
      assetMetadata: metadata,
    },
    updatedAt: '2026-09-23T15:30:00.000Z',
  })

  expect(
    createLocalProjectSnapshot(state.project, () => null),
  ).toBeNull()

  const snapshot = createLocalProjectSnapshot(state.project, (candidateId) =>
    candidateId === assetId
      ? {
          file,
          objectUrl: 'blob:test',
          metadata,
        }
      : null,
  )

  expect(snapshot).not.toBeNull()
  expect(snapshot?.storageVersion).toBe(1)
  expect(snapshot?.project).toBe(state.project)
  expect(snapshot?.assets).toEqual([
    {
      assetId,
      metadata,
      file,
    },
  ])
})
