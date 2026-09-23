import type { EditorColor } from './editorColor'
import { createSolidFill } from './editorFill'
import { DEFAULT_ELEMENT_FRAME, type ElementFrame } from './elementFrame'
import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorElement,
  type EditorPage,
  type EditorProject,
  type HeaderEditorElement,
  type SectionEditorElement,
  type TextEditorElement,
} from './editorProject'
import type { HeaderAppearance } from './headerAppearance'
import { createUniqueSectionAnchorId } from './siteStructure'

type PageAppearanceV12 = {
  backgroundColor: EditorColor
}

type SectionAppearanceV12 = {
  backgroundColor: EditorColor
  frame: ElementFrame
}

type TextAppearanceV12 = {
  backgroundColor: EditorColor
  frame: ElementFrame
}

type HeaderAppearanceV12 = Omit<HeaderAppearance, 'backgroundFill'> & {
  backgroundColor: EditorColor
}

type SectionEditorElementV12 = Omit<SectionEditorElement, 'appearance'> & {
  appearance: SectionAppearanceV12
}

type TextEditorElementV12 = Omit<TextEditorElement, 'appearance'> & {
  appearance: TextAppearanceV12
}

type HeaderEditorElementV12 = Omit<HeaderEditorElement, 'appearance'> & {
  appearance: HeaderAppearanceV12
}

type EditorElementV12 =
  | SectionEditorElementV12
  | TextEditorElementV12
  | HeaderEditorElementV12
  | Exclude<
      EditorElement,
      SectionEditorElement | TextEditorElement | HeaderEditorElement
    >

type EditorPageV12 = Omit<EditorPage, 'appearance' | 'elements'> & {
  appearance: PageAppearanceV12
  elements: EditorElementV12[]
}

export type EditorProjectV12 = Omit<EditorProject, 'schemaVersion' | 'pages'> & {
  schemaVersion: 12
  pages: EditorPageV12[]
}

type TextAppearanceV11 = Pick<TextAppearanceV12, 'backgroundColor'>
type TextEditorElementV11 = Omit<TextEditorElementV12, 'appearance'> & {
  appearance: TextAppearanceV11
}

type EditorElementV11 =
  | TextEditorElementV11
  | Exclude<EditorElementV12, TextEditorElementV12>

type EditorPageV11 = Omit<EditorPageV12, 'elements'> & {
  elements: EditorElementV11[]
}

export type EditorProjectV11 = Omit<EditorProjectV12, 'schemaVersion' | 'pages'> & {
  schemaVersion: 11
  pages: EditorPageV11[]
}

type SectionEditorElementV10 = Omit<SectionEditorElementV12, 'anchorId'>
type EditorElementV10 =
  | SectionEditorElementV10
  | TextEditorElementV11
  | Exclude<
      EditorElementV12,
      SectionEditorElementV12 | TextEditorElementV12
    >

type EditorPageV10 = Omit<EditorPageV12, 'elements'> & {
  elements: EditorElementV10[]
}

export type EditorProjectV10 = Omit<
  EditorProjectV12,
  'schemaVersion' | 'pages' | 'navigation'
> & {
  schemaVersion: 10
  pages: EditorPageV10[]
}

function migrateTextElementV11(
  element: TextEditorElementV11,
): TextEditorElementV12 {
  return {
    ...element,
    appearance: {
      ...element.appearance,
      frame: { ...DEFAULT_ELEMENT_FRAME },
    },
  }
}

function migratePageV11(page: EditorPageV11): EditorPageV12 {
  return {
    ...page,
    elements: page.elements.map((element) =>
      element.kind === 'text' ? migrateTextElementV11(element) : element,
    ),
  }
}

function migratePageV10(page: EditorPageV10): EditorPageV12 {
  const usedAnchorIds: string[] = []

  return {
    ...page,
    elements: page.elements.map((element) => {
      if (element.kind === 'text') {
        return migrateTextElementV11(element)
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

function migrateElementV12(element: EditorElementV12): EditorElement {
  if (element.kind === 'section') {
    return {
      ...element,
      appearance: {
        backgroundFill: createSolidFill(element.appearance.backgroundColor),
        frame: { ...element.appearance.frame },
      },
    }
  }

  if (element.kind === 'text') {
    return {
      ...element,
      appearance: {
        backgroundFill: createSolidFill(element.appearance.backgroundColor),
        frame: { ...element.appearance.frame },
      },
    }
  }

  if (element.kind === 'header') {
    const { backgroundColor, ...appearance } = element.appearance
    return {
      ...element,
      appearance: {
        ...appearance,
        backgroundFill: createSolidFill(backgroundColor),
        frame: { ...appearance.frame },
      },
    }
  }

  return element
}

function migratePageV12ToCurrent(page: EditorPageV12): EditorPage {
  return {
    ...page,
    appearance: {
      backgroundFill: createSolidFill(page.appearance.backgroundColor),
    },
    elements: page.elements.map(migrateElementV12),
  }
}

export function migrateEditorProjectV12(project: EditorProjectV12): EditorProject {
  return {
    ...project,
    schemaVersion: EDITOR_PROJECT_SCHEMA_VERSION,
    pages: project.pages.map(migratePageV12ToCurrent),
  }
}

export function migrateEditorProjectV11(project: EditorProjectV11): EditorProject {
  const v12: EditorProjectV12 = {
    ...project,
    schemaVersion: 12,
    pages: project.pages.map(migratePageV11),
  }
  return migrateEditorProjectV12(v12)
}

export function migrateEditorProjectV10(project: EditorProjectV10): EditorProject {
  const v12: EditorProjectV12 = {
    ...project,
    schemaVersion: 12,
    pages: project.pages.map(migratePageV10),
    navigation: { items: [] },
  }
  return migrateEditorProjectV12(v12)
}
