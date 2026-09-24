import type { EditorProject } from './editorProject'
import { migrateEditorProjectV15, type EditorProjectV15 } from './editorProjectMigrationV15'

export type EditorProjectV14 = Omit<EditorProjectV15, 'schemaVersion'> & {
  schemaVersion: 14
}

export function migrateEditorProjectV14(project: EditorProjectV14): EditorProject {
  return migrateEditorProjectV15({ ...project, schemaVersion: 15 })
}
