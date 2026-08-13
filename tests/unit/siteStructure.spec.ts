import { expect, test } from '@playwright/test'
import { createEditorElement } from '../../src/model/createEditorElement'
import { createBlankProject } from '../../src/model/createEditorProject'
import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorProject,
  type SectionEditorElement,
} from '../../src/model/editorProject'
import {
  migrateEditorProjectV10,
  type EditorProjectV10,
} from '../../src/model/editorProjectMigration'
import { pruneDanglingNavigationItems } from '../../src/model/navigation'
import {
  createUniqueSectionAnchorId,
  isValidPageSlug,
  isValidProjectSiteStructure,
  normalizePageName,
  normalizePageSlug,
  normalizeSectionAnchorId,
} from '../../src/model/siteStructure'

function createSection(
  id: string,
  existingElements: EditorProject['pages'][number]['elements'] = [],
): SectionEditorElement {
  const element = createEditorElement({
    id,
    request: { kind: 'section' },
    existingElements,
  })

  if (element.kind !== 'section') {
    throw new Error('Expected a section element.')
  }

  return element
}

test.describe('site structure model', () => {
  test('normalizes page names, page slugs and public section anchors', () => {
    expect(normalizePageName('  Om   oss  ')).toBe('Om oss')
    expect(normalizePageSlug(' Om oss ')).toBe('/om-oss')
    expect(normalizePageSlug('/Blåbær & Æbler/')).toBe('/blabaer-aebler')
    expect(normalizePageSlug('///')).toBeNull()
    expect(isValidPageSlug('/om-oss')).toBe(true)
    expect(isValidPageSlug('/Om-oss')).toBe(false)
    expect(normalizeSectionAnchorId('#Kontakt oss')).toBe('kontakt-oss')
  })

  test('creates stable unique section anchors independently of element IDs', () => {
    expect(createUniqueSectionAnchorId([])).toBe('seksjon')
    expect(createUniqueSectionAnchorId(['seksjon', 'seksjon-2'])).toBe(
      'seksjon-3',
    )

    const first = createSection('internal-section-a')
    const second = createSection('internal-section-b', [first])

    expect(first.anchorId).toBe('seksjon')
    expect(second.anchorId).toBe('seksjon-2')
    expect(first.anchorId).not.toBe(first.id)
  })

  test('validates navigation references against pages and section element IDs', () => {
    const project = createBlankProject('Navigasjon')
    const page = project.pages[0]
    const section = createSection('section-1')
    const navigation = {
      items: [
        {
          id: 'nav-1',
          label: 'Kontakt',
          target: {
            type: 'section' as const,
            pageId: page.id,
            elementId: section.id,
          },
        },
      ],
    }
    const validProject: EditorProject = {
      ...project,
      pages: [{ ...page, elements: [section] }],
      navigation,
    }

    expect(isValidProjectSiteStructure(validProject)).toBe(true)

    const danglingProject = {
      ...validProject,
      navigation: {
        items: [
          {
            ...navigation.items[0],
            target: { ...navigation.items[0].target, elementId: 'missing' },
          },
        ],
      },
    }

    expect(isValidProjectSiteStructure(danglingProject)).toBe(false)
    expect(
      pruneDanglingNavigationItems(
        danglingProject.navigation,
        danglingProject.pages,
      ).items,
    ).toEqual([])
  })

  test('migrates schema 10 deterministically with anchors and empty navigation', () => {
    const project = createBlankProject('Migrering')
    const page = project.pages[0]
    const first = createSection('legacy-section-a')
    const second = createSection('legacy-section-b', [first])

    const legacy: EditorProjectV10 = {
      schemaVersion: 10,
      id: project.id,
      name: project.name,
      pages: [
        {
          id: page.id,
          name: page.name,
          slug: page.slug,
          appearance: page.appearance,
          elements: [
            {
              id: first.id,
              kind: 'section',
              position: first.position,
              size: first.size,
              visibility: first.visibility,
              locked: first.locked,
              appearance: first.appearance,
            },
            {
              id: second.id,
              kind: 'section',
              position: second.position,
              size: second.size,
              visibility: second.visibility,
              locked: second.locked,
              appearance: second.appearance,
            },
          ],
        },
      ],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }

    const firstMigration = migrateEditorProjectV10(legacy)
    const secondMigration = migrateEditorProjectV10(legacy)
    const migratedSections = firstMigration.pages[0].elements.filter(
      (element): element is SectionEditorElement => element.kind === 'section',
    )

    expect(firstMigration).toEqual(secondMigration)
    expect(firstMigration.schemaVersion).toBe(EDITOR_PROJECT_SCHEMA_VERSION)
    expect(firstMigration.navigation).toEqual({ items: [] })
    expect(migratedSections.map((section) => section.anchorId)).toEqual([
      'seksjon',
      'seksjon-2',
    ])
    expect(isValidProjectSiteStructure(firstMigration)).toBe(true)
  })
})
