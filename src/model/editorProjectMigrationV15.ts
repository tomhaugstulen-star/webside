import type { EditorProject } from './editorProject'
import { DEFAULT_SITE_SETTINGS } from './siteSettings'

export type EditorProjectV15 = Omit<EditorProject, 'schemaVersion' | 'siteSettings' | 'pages'> & {
  schemaVersion: 15
  pages: Array<Omit<EditorProject['pages'][number], 'seo'>>
}

export function migrateEditorProjectV15(project: EditorProjectV15): EditorProject {
  return {
    ...project,
    schemaVersion: 16,
    siteSettings: { ...DEFAULT_SITE_SETTINGS },
    pages: project.pages.map((page) => ({
      ...page,
      seo: { title: page.name, description: '' },
    })),
  }
}
