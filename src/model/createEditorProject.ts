import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorPage,
  type EditorProject,
  type EditorProjectState,
} from './editorProject'
import { createStableId } from './createStableId'
import { DEFAULT_PAGE_APPEARANCE } from './pageAppearance'

export { migrateEditorProjectV10 } from './editorProjectMigration'

export function createEditorPage(
  id: string,
  name: string,
  slug: string,
): EditorPage {
  return {
    id,
    name,
    slug,
    appearance: { ...DEFAULT_PAGE_APPEARANCE },
    elements: [],
  }
}

export function createBlankPage(name = 'Forside', slug = '/'): EditorPage {
  return createEditorPage(createStableId(), name, slug)
}

export function createBlankProject(name = 'Nytt prosjekt'): EditorProject {
  const createdAt = new Date().toISOString()
  const firstPage = createBlankPage()

  return {
    schemaVersion: EDITOR_PROJECT_SCHEMA_VERSION,
    id: createStableId(),
    name,
    pages: [firstPage],
    navigation: { items: [] },
    createdAt,
    updatedAt: createdAt,
  }
}

export function createInitialEditorProjectState(): EditorProjectState {
  const project = createBlankProject()

  return {
    project,
    activePageId: project.pages[0].id,
    selectedElementId: null,
  }
}
