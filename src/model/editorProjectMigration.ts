import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorElement,
  type EditorPage,
  type EditorProject,
  type SectionEditorElement,
} from './editorProject'
import { createUniqueSectionAnchorId } from './siteStructure'

type LegacySectionEditorElement = Omit<SectionEditorElement, 'anchorId'>
type LegacyEditorElement =
  | LegacySectionEditorElement
  | Exclude<EditorElement, SectionEditorElement>

type EditorPageV10 = Omit<EditorPage, 'elements'> & {
  elements: LegacyEditorElement[]
}

export type EditorProjectV10 = Omit<
  EditorProject,
  'schemaVersion' | 'pages' | 'navigation'
> & {
  schemaVersion: 10
  pages: EditorPageV10[]
}

function migratePageV10(page: EditorPageV10): EditorPage {
  const usedAnchorIds: string[] = []

  return {
    ...page,
    elements: page.elements.map((element) => {
      if (element.kind !== 'section') {
        return element
      }

      const anchorId = createUniqueSectionAnchorId(usedAnchorIds)
      usedAnchorIds.push(anchorId)

      return {
        ...element,
        anchorId,
      }
    }),
  }
}

export function migrateEditorProjectV10(project: EditorProjectV10): EditorProject {
  return {
    ...project,
    schemaVersion: EDITOR_PROJECT_SCHEMA_VERSION,
    pages: project.pages.map(migratePageV10),
    navigation: { items: [] },
  }
}
