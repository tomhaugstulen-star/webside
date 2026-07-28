import type { ElementLayout } from '../model/elementLayout'
import type { EditorProject, ElementKind } from '../model/editorProject'
import type { TextElementStylePatch } from '../model/textElementStyle'

export type EditorProjectAction =
  | { type: 'replace-project'; project: EditorProject }
  | { type: 'set-active-page'; pageId: string }
  | { type: 'set-selected-element'; elementId: string | null }
  | {
      type: 'add-element-to-active-page'
      elementId: string
      kind: ElementKind
      updatedAt: string
    }
  | {
      type: 'set-element-desktop-layout'
      elementId: string
      layout: ElementLayout
      updatedAt: string
    }
  | {
      type: 'toggle-element-lock'
      elementId: string
      updatedAt: string
    }
  | {
      type: 'set-text-element-content'
      elementId: string
      content: string
      updatedAt: string
    }
  | {
      type: 'set-text-element-style'
      elementId: string
      patch: TextElementStylePatch
      updatedAt: string
    }
