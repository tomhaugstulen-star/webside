import { DEFAULT_ELEMENT_FRAME } from './elementFrame'
import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorElement,
  type EditorPage,
  type EditorProject,
  type SectionEditorElement,
  type TextEditorElement,
} from './editorProject'
import { createUniqueSectionAnchorId } from './siteStructure'
import type { TextAppearance } from './textAppearance'

type LegacyTextAppearance = Pick<TextAppearance, 'backgroundColor'>
type LegacyTextEditorElement = Omit<TextEditorElement, 'appearance'> & {
  appearance: LegacyTextAppearance
}

type LegacySectionEditorElementV10 = Omit<SectionEditorElement, 'anchorId'>
type LegacyEditorElementV10 =
  | LegacySectionEditorElementV10
  | LegacyTextEditorElement
  | Exclude<EditorElement, SectionEditorElement | TextEditorElement>

type EditorPageV10 = Omit<EditorPage, 'elements'> & {
  elements: LegacyEditorElementV10[]
}

export type EditorProjectV10 = Omit<
  EditorProject,
  'schemaVersion' | 'pages' | 'navigation'
> & {
  schemaVersion: 10
  pages: EditorPageV10[]
}

type EditorElementV11 =
  | LegacyTextEditorElement
  | Exclude<EditorElement, TextEditorElement>

type EditorPageV11 = Omit<EditorPage, 'elements'> & {
  elements: EditorElementV11[]
}

export type EditorProjectV11 = Omit<EditorProject, 'schemaVersion' | 'pages'> & {
  schemaVersion: 11
  pages: EditorPageV11[]
}

function migrateTextElement(element: LegacyTextEditorElement): TextEditorElement {
  return {
    ...element,
    appearance: {
      ...element.appearance,
      frame: { ...DEFAULT_ELEMENT_FRAME },
    },
  }
}

function migratePageV11(page: EditorPageV11): EditorPage {
  return {
    ...page,
    elements: page.elements.map((element) =>
      element.kind === 'text' ? migrateTextElement(element) : element,
    ),
  }
}

function migratePageV10(page: EditorPageV10): EditorPage {
  const usedAnchorIds: string[] = []

  return {
    ...page,
    elements: page.elements.map((element) => {
      if (element.kind === 'text') {
        return migrateTextElement(element)
      }

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

export function migrateEditorProjectV11(project: EditorProjectV11): EditorProject {
  return {
    ...project,
    schemaVersion: EDITOR_PROJECT_SCHEMA_VERSION,
    pages: project.pages.map(migratePageV11),
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
