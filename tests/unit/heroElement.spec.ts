import { expect, test } from '@playwright/test'
import { createBlankProject } from '../../src/model/createEditorProject'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createImageAssetId } from '../../src/model/imageAsset'
import {
  isValidEditorProject,
  parseImportedEditorProject,
} from '../../src/model/editorProjectValidation'
import { getProjectAssetReferences } from '../../src/projectFiles/projectAssetReferences'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from '../../src/state/editorProjectReducer'

const CREATED_AT = '2026-09-23T09:30:00.000Z'
const UPDATED_AT = '2026-09-23T09:31:00.000Z'

const metadata = {
  fileName: 'hero.png',
  mimeType: 'image/png' as const,
  byteSize: 68,
  width: 1200,
  height: 800,
}

function addHero() {
  const state = getInitialEditorProjectState()
  const assetId = createImageAssetId()
  const next = editorProjectReducer(state, {
    type: 'add-element-to-active-page',
    elementId: 'hero-1',
    request: {
      kind: 'hero',
      imageAssetId: assetId,
      imageAssetMetadata: metadata,
    },
    updatedAt: CREATED_AT,
  })

  const hero = next.project.pages[0].elements[0]
  if (!hero || hero.kind !== 'hero') {
    throw new Error('Expected Hero element.')
  }

  return { state: next, hero, assetId }
}

test('creates a valid Hero with mobile-safe defaults and asset reference', () => {
  const { state, hero, assetId } = addHero()

  expect(hero.size.desktop).toEqual({ width: 340, height: 220 })
  expect(hero.title).toBe('Din overskrift')
  expect(hero.ctaLabel).toBe('Les mer')
  expect(hero.ctaLink).toEqual({ type: 'none' })
  expect(isValidEditorProject(state.project)).toBe(true)
  expect(getProjectAssetReferences(state.project)).toEqual([
    { assetId, metadata },
  ])
})

test('updates Hero content and CTA link through typed reducer actions', () => {
  const { state } = addHero()
  const contentUpdated = editorProjectReducer(state, {
    type: 'set-hero-content',
    elementId: 'hero-1',
    title: 'Ny overskrift',
    subtitle: 'Kort introduksjon',
    ctaLabel: 'Bestill nå',
    updatedAt: UPDATED_AT,
  })

  const linked = editorProjectReducer(contentUpdated, {
    type: 'set-element-link',
    elementId: 'hero-1',
    link: {
      type: 'external-url',
      url: 'https://example.com/',
      openInNewTab: false,
    },
    updatedAt: UPDATED_AT,
  })

  const hero = linked.project.pages[0].elements[0]
  if (!hero || hero.kind !== 'hero') throw new Error('Expected Hero element.')

  expect(hero.title).toBe('Ny overskrift')
  expect(hero.subtitle).toBe('Kort introduksjon')
  expect(hero.ctaLabel).toBe('Bestill nå')
  expect(hero.ctaLink).toEqual({
    type: 'external-url',
    url: 'https://example.com/',
    openInNewTab: false,
  })
})

test('allows Hero title and subtitle to be removed by saving empty values', () => {
  const { state } = addHero()
  const updated = editorProjectReducer(state, {
    type: 'set-hero-content',
    elementId: 'hero-1',
    title: '',
    subtitle: '',
    ctaLabel: 'Les mer',
    updatedAt: UPDATED_AT,
  })

  const hero = updated.project.pages[0].elements[0]
  if (!hero || hero.kind !== 'hero') throw new Error('Expected Hero element.')

  expect(hero.title).toBe('')
  expect(hero.subtitle).toBe('')
  expect(isValidEditorProject(updated.project)).toBe(true)
})

test('rejects Hero mutations while locked', () => {
  const { state } = addHero()
  const locked = editorProjectReducer(state, {
    type: 'toggle-element-lock',
    elementId: 'hero-1',
    updatedAt: UPDATED_AT,
  })

  expect(
    editorProjectReducer(locked, {
      type: 'set-hero-content',
      elementId: 'hero-1',
      title: 'Skal ikke lagres',
      subtitle: '',
      ctaLabel: 'Klikk',
      updatedAt: UPDATED_AT,
    }),
  ).toBe(locked)
})

test('migrates schema 13 to 14 and rejects Hero injected into schema 13', () => {
  const project = createBlankProject('Legacy')
  const legacy = { ...project, schemaVersion: 13 }
  expect(parseImportedEditorProject(legacy)?.schemaVersion).toBe(15)

  const assetId = createImageAssetId()
  const hero = createEditorElement({
    id: 'hero-legacy',
    existingElements: [],
    request: {
      kind: 'hero',
      imageAssetId: assetId,
      imageAssetMetadata: metadata,
    },
  })
  const invalidLegacy = {
    ...legacy,
    pages: [{ ...legacy.pages[0], elements: [hero] }],
  }

  expect(parseImportedEditorProject(invalidLegacy)).toBeNull()
})
