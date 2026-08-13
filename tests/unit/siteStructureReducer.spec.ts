import { expect, test } from '@playwright/test'
import type {
  EditorProject,
  EditorProjectState,
  SectionEditorElement,
} from '../../src/model/editorProject'
import { createUniquePageSlug } from '../../src/model/siteStructure'
import {
  editorProjectReducer,
  getInitialEditorProjectState,
} from '../../src/state/editorProjectReducer'

const UPDATED_AT = '2026-08-14T00:10:00.000Z'
const LATER_AT = '2026-08-14T00:11:00.000Z'

function getActiveSection(
  state: EditorProjectState,
  elementId: string,
): SectionEditorElement {
  const page = state.project.pages.find(
    (candidate) => candidate.id === state.activePageId,
  )
  const element = page?.elements.find(
    (candidate) => candidate.id === elementId,
  )

  if (!element || element.kind !== 'section') {
    throw new Error('Expected an active section in the test fixture.')
  }

  return element
}

test.describe('site structure reducer', () => {
  test('creates unique slugs and manages the page lifecycle deterministically', () => {
    expect(createUniquePageSlug(['/side', '/side-2'], 'side')).toBe('/side-3')

    const initial = getInitialEditorProjectState()
    const firstPageId = initial.project.pages[0].id
    const added = editorProjectReducer(initial, {
      type: 'add-page',
      pageId: 'page-2',
      name: 'Om oss',
      slug: '/om-oss',
      updatedAt: UPDATED_AT,
    })

    expect(added.project.pages).toHaveLength(2)
    expect(added.activePageId).toBe('page-2')
    expect(added.selectedElementId).toBeNull()
    expect(added.project.updatedAt).toBe(UPDATED_AT)

    expect(
      editorProjectReducer(added, {
        type: 'add-page',
        pageId: 'page-3',
        name: 'Duplikat',
        slug: '/om-oss',
        updatedAt: LATER_AT,
      }),
    ).toBe(added)

    expect(
      editorProjectReducer(added, {
        type: 'set-page-name',
        pageId: 'page-2',
        name: ' Om oss ',
        updatedAt: LATER_AT,
      }),
    ).toBe(added)

    const renamed = editorProjectReducer(added, {
      type: 'set-page-name',
      pageId: 'page-2',
      name: 'Kontakt',
      updatedAt: LATER_AT,
    })
    expect(renamed.project.pages[1].name).toBe('Kontakt')

    expect(
      editorProjectReducer(renamed, {
        type: 'set-page-slug',
        pageId: 'page-2',
        slug: '/',
        updatedAt: LATER_AT,
      }),
    ).toBe(renamed)

    const reslugged = editorProjectReducer(renamed, {
      type: 'set-page-slug',
      pageId: 'page-2',
      slug: '/kontakt',
      updatedAt: LATER_AT,
    })
    const moved = editorProjectReducer(reslugged, {
      type: 'move-page',
      pageId: 'page-2',
      direction: 'up',
      updatedAt: LATER_AT,
    })

    expect(moved.project.pages.map((page) => page.id)).toEqual([
      'page-2',
      firstPageId,
    ])

    const deleted = editorProjectReducer(moved, {
      type: 'delete-page',
      pageId: 'page-2',
      updatedAt: LATER_AT,
    })

    expect(deleted.project.pages.map((page) => page.id)).toEqual([firstPageId])
    expect(deleted.activePageId).toBe(firstPageId)
    expect(deleted.selectedElementId).toBeNull()

    expect(
      editorProjectReducer(deleted, {
        type: 'delete-page',
        pageId: firstPageId,
        updatedAt: LATER_AT,
      }),
    ).toBe(deleted)
  })


  test('rejects project replacement with an invalid site structure', () => {
    const initial = getInitialEditorProjectState()
    const firstPage = initial.project.pages[0]
    const invalidProject: EditorProject = {
      ...initial.project,
      pages: [
        firstPage,
        {
          ...firstPage,
          id: 'page-2',
        },
      ],
    }

    expect(
      editorProjectReducer(initial, {
        type: 'replace-project',
        project: invalidProject,
      }),
    ).toBe(initial)
  })

  test('keeps navigation stable across anchor edits and prunes deleted sections', () => {
    const initial = getInitialEditorProjectState()
    const pageId = initial.activePageId
    const withSection = editorProjectReducer(initial, {
      type: 'add-element-to-active-page',
      elementId: 'section-1',
      request: { kind: 'section' },
      updatedAt: UPDATED_AT,
    })
    const withNavigation = editorProjectReducer(withSection, {
      type: 'add-navigation-item',
      itemId: 'nav-1',
      label: 'Kontakt',
      target: {
        type: 'section',
        pageId,
        elementId: 'section-1',
      },
      updatedAt: LATER_AT,
    })
    const renamedAnchor = editorProjectReducer(withNavigation, {
      type: 'set-section-anchor-id',
      elementId: 'section-1',
      anchorId: 'kontakt',
      updatedAt: LATER_AT,
    })

    expect(getActiveSection(renamedAnchor, 'section-1').anchorId).toBe('kontakt')
    expect(renamedAnchor.project.navigation.items[0].target).toEqual({
      type: 'section',
      pageId,
      elementId: 'section-1',
    })

    const withSecondSection = editorProjectReducer(renamedAnchor, {
      type: 'add-element-to-active-page',
      elementId: 'section-2',
      request: { kind: 'section' },
      updatedAt: LATER_AT,
    })

    expect(
      editorProjectReducer(withSecondSection, {
        type: 'set-section-anchor-id',
        elementId: 'section-2',
        anchorId: 'kontakt',
        updatedAt: LATER_AT,
      }),
    ).toBe(withSecondSection)

    const deleted = editorProjectReducer(withSecondSection, {
      type: 'delete-element-from-active-page',
      elementId: 'section-1',
      updatedAt: LATER_AT,
    })

    expect(deleted.project.navigation.items).toEqual([])
  })

  test('validates, reorders, retargets and deletes navigation items', () => {
    const initial = getInitialEditorProjectState()
    const firstPageId = initial.activePageId
    const withPage = editorProjectReducer(initial, {
      type: 'add-page',
      pageId: 'page-2',
      name: 'Om oss',
      slug: '/om-oss',
      updatedAt: UPDATED_AT,
    })
    const firstItem = editorProjectReducer(withPage, {
      type: 'add-navigation-item',
      itemId: 'nav-1',
      label: 'Forside',
      target: { type: 'page', pageId: firstPageId },
      updatedAt: UPDATED_AT,
    })
    const secondItem = editorProjectReducer(firstItem, {
      type: 'add-navigation-item',
      itemId: 'nav-2',
      label: 'Om oss',
      target: { type: 'page', pageId: 'page-2' },
      updatedAt: UPDATED_AT,
    })

    expect(
      editorProjectReducer(secondItem, {
        type: 'set-navigation-item-target',
        itemId: 'nav-1',
        target: { type: 'page', pageId: 'missing-page' },
        updatedAt: LATER_AT,
      }),
    ).toBe(secondItem)

    const relabeled = editorProjectReducer(secondItem, {
      type: 'set-navigation-item-label',
      itemId: 'nav-1',
      label: 'Hjem',
      updatedAt: LATER_AT,
    })
    const moved = editorProjectReducer(relabeled, {
      type: 'move-navigation-item',
      itemId: 'nav-2',
      direction: 'up',
      updatedAt: LATER_AT,
    })

    expect(moved.project.navigation.items.map((item) => item.id)).toEqual([
      'nav-2',
      'nav-1',
    ])

    const retargeted = editorProjectReducer(moved, {
      type: 'set-navigation-item-target',
      itemId: 'nav-1',
      target: { type: 'page', pageId: 'page-2' },
      updatedAt: LATER_AT,
    })
    expect(retargeted.project.navigation.items[1].target).toEqual({
      type: 'page',
      pageId: 'page-2',
    })

    const deleted = editorProjectReducer(retargeted, {
      type: 'delete-navigation-item',
      itemId: 'nav-2',
      updatedAt: LATER_AT,
    })
    expect(deleted.project.navigation.items.map((item) => item.id)).toEqual([
      'nav-1',
    ])

    const pageDeleted = editorProjectReducer(deleted, {
      type: 'delete-page',
      pageId: 'page-2',
      updatedAt: LATER_AT,
    })
    expect(pageDeleted.project.navigation.items).toEqual([])
  })
})
