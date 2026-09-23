import { EDITOR_PROJECT_SCHEMA_VERSION, type EditorProject } from './editorProject'

export type EditorProjectV14 = Omit<EditorProject, 'schemaVersion'> & {
  schemaVersion: 14
}

export function migrateEditorProjectV14(project: EditorProjectV14): EditorProject {
  return { ...project, schemaVersion: EDITOR_PROJECT_SCHEMA_VERSION }
}
