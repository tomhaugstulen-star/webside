import { expect, test } from '@playwright/test'
import { createInitialEditorProjectState } from '../../src/model/createEditorProject'
import { createImageAssetId } from '../../src/model/imageAsset'
import {
  getReferencedImageAssetIds,
  isValidEditorProject,
} from '../../src/persistence/editorProjectValidation'
import {
  createLocalProjectEnvelope,
  validateLocalProjectSnapshot,
} from '../../src/persistence/localProjectSnapshot'
import { editorProjectReducer } from '../../src/state/editorProjectReducer'

const UPDATED_AT = '2099-01-01T00:00:00.000Z'

function createProjectWithImage() {
  const state = createInitialEditorProjectState()
  const assetId = createImageAssetId()
  const file = new File([new Uint8Array([1, 2, 3])], 'image.png', {
    type: 'image/png',
  })
  const metadata = {
    fileName: file.name,
    mimeType: 'image/png' as const,
    byteSize: file.size,
    width: 1,
    height: 1,
  }
  const nextState = editorProjectReducer(state, {
    type: 'add-element-to-active-page',
    elementId: crypto.randomUUID(),
    request: { kind: 'image', assetId, assetMetadata: metadata },
    updatedAt: UPDATED_AT,
  })

  return { project: nextState.project, assetId, file, metadata }
}

test.describe('local project persistence validation', () => {
  test('accepts a current project and rejects unsupported or duplicate data', () => {
    const project = createInitialEditorProjectState().project

    expect(isValidEditorProject(project)).toBe(true)
    expect(isValidEditorProject({ ...project, schemaVersion: 9 })).toBe(false)
    expect(
      isValidEditorProject({
        ...project,
        pages: [{ ...project.pages[0], id: project.id }],
      }),
    ).toBe(false)
    expect(
      isValidEditorProject({
        ...project,
        updatedAt: '2020-01-01T00:00:00.000Z',
      }),
    ).toBe(false)
  })

  test('collects image and logo references without duplicates', () => {
    const { project, assetId } = createProjectWithImage()

    expect([...getReferencedImageAssetIds(project)]).toEqual([assetId])
  })

  test('requires every referenced image file before accepting a snapshot', () => {
    const { project, assetId, file, metadata } = createProjectWithImage()
    const envelope = createLocalProjectEnvelope(project, UPDATED_AT)

    expect(envelope).not.toBeNull()
    expect(validateLocalProjectSnapshot(envelope, [])).toBeNull()
    expect(
      validateLocalProjectSnapshot(envelope, [
        { assetId, file, metadata },
      ]),
    ).toEqual({
      envelope,
      assets: [{ assetId, file, metadata }],
    })
  })

  test('rejects project and file metadata mismatches', () => {
    const { project, assetId, file, metadata } = createProjectWithImage()
    const envelope = createLocalProjectEnvelope(project, UPDATED_AT)

    expect(
      validateLocalProjectSnapshot(envelope, [
        {
          assetId,
          file,
          metadata: { ...metadata, width: metadata.width + 1 },
        },
      ]),
    ).toBeNull()
    expect(
      validateLocalProjectSnapshot(envelope, [
        {
          assetId,
          file,
          metadata: { ...metadata, byteSize: metadata.byteSize + 1 },
        },
      ]),
    ).toBeNull()
  })

  test('ignores invalid orphan data but rejects unsupported envelopes', () => {
    const project = createInitialEditorProjectState().project
    const envelope = createLocalProjectEnvelope(project, UPDATED_AT)

    expect(validateLocalProjectSnapshot(envelope, [{ corrupt: true }])).toEqual({
      envelope,
      assets: [],
    })
    expect(
      validateLocalProjectSnapshot(
        { ...envelope, storageVersion: 2 },
        [],
      ),
    ).toBeNull()
  })
})
