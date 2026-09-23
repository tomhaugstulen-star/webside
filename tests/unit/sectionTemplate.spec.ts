import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createBlankProject } from '../../src/model/createEditorProject'
import type { EditorElement, EditorPage } from '../../src/model/editorProject'
import { captureSectionTemplate } from '../../src/templates/captureSectionTemplate'
import { instantiateSectionTemplate } from '../../src/templates/instantiateSectionTemplate'
import type { SectionTemplate } from '../../src/templates/sectionTemplate'
import {
  editorHistoryReducer,
  getInitialEditorHistoryState,
} from '../../src/state/editorHistoryReducer'

const AT = '2026-09-23T20:45:00.000Z'

function section(id: string, x: number, y: number, anchorId = 'seksjon') {
  const created = createEditorElement({
    id,
    request: { kind: 'section' },
    existingElements: [],
  })

  if (created.kind !== 'section') throw new Error('Expected section')

  return {
    ...created,
    anchorId,
    position: { desktop: { x, y }, mobile: { x, y: y + 10 } },
    size: {
      desktop: { width: 700, height: 400 },
      mobile: { width: 360, height: 420 },
    },
  }
}

function text(id: string, x: number, y: number) {
  const created = createEditorElement({
    id,
    request: { kind: 'text' },
    existingElements: [],
  })

  if (created.kind !== 'text') throw new Error('Expected text')

  return {
    ...created,
    content: id,
    position: { desktop: { x, y }, mobile: { x, y: y + 10 } },
    size: {
      desktop: { width: 180, height: 80 },
      mobile: { width: 180, height: 80 },
    },
  }
}

function page(elements: EditorElement[]): EditorPage {
  return {
    id: 'page-1',
    name: 'Forside',
    slug: '/',
    appearance: createBlankProject().pages[0].appearance,
    elements,
  }
}

test('captures only the section and elements fully inside its desktop frame', () => {
  const sourceSection = section('section-1', 20, 100)
  const inside = text('inside', 40, 140)
  const outside = text('outside', 650, 460)
  const template = captureSectionTemplate(
    page([sourceSection, inside, outside]),
    sourceSection.id,
    { id: 'template-1', name: 'Forsideblokk', createdAt: AT },
    () => null,
  )

  expect(template).not.toBeNull()
  expect(template?.elements.map((element) => element.id)).toEqual([
    'section-1',
    'inside',
  ])
  expect(template?.assets).toEqual([])
})

test('instantiation creates new ids, a unique anchor and preserves relative offsets', () => {
  const sourceSection = section('section-1', 20, 100, 'intro')
  const child = text('text-1', 60, 160)
  const template: SectionTemplate = {
    version: 1,
    id: 'template-1',
    name: 'Intro',
    createdAt: AT,
    elements: [sourceSection, child],
    assets: [],
  }
  const existing = [section('existing', 20, 0, 'intro')]
  const insertion = instantiateSectionTemplate(template, existing)

  expect(insertion).not.toBeNull()
  const insertedSection = insertion?.elements.find(
    (element) => element.kind === 'section',
  )
  const insertedText = insertion?.elements.find(
    (element) => element.kind === 'text',
  )

  expect(insertedSection?.id).not.toBe(sourceSection.id)
  expect(insertedText?.id).not.toBe(child.id)
  expect(insertedSection?.kind === 'section' && insertedSection.anchorId).toBe(
    'intro-2',
  )
  expect(
    (insertedText?.position.desktop.y ?? 0) -
      (insertedSection?.position.desktop.y ?? 0),
  ).toBe(60)
  expect(
    (insertedText?.position.mobile?.y ?? 0) -
      (insertedSection?.position.mobile?.y ?? 0),
  ).toBe(60)
})

test('template insertion is one undoable editor history mutation', () => {
  const initial = getInitialEditorHistoryState()
  const sourceSection = section('new-section', 20, 100, 'mal')
  const child = text('new-text', 60, 160)

  const inserted = editorHistoryReducer(initial, {
    type: 'insert-elements-to-active-page',
    elements: [sourceSection, child],
    selectedElementId: sourceSection.id,
    updatedAt: AT,
  })

  expect(inserted.past).toHaveLength(1)
  expect(inserted.present.project.pages[0].elements).toHaveLength(2)

  const undone = editorHistoryReducer(inserted, { type: 'undo' })
  expect(undone.present.project.pages[0].elements).toHaveLength(0)

  const redone = editorHistoryReducer(undone, { type: 'redo' })
  expect(redone.present.project.pages[0].elements).toHaveLength(2)
})
