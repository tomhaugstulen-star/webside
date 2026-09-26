import type { EditorProject } from './editorProject'

export type EditorProjectV16 = Omit<EditorProject, 'schemaVersion'> & {
  schemaVersion: 16
}

export function migrateEditorProjectV16(project: EditorProjectV16): EditorProject {
  return {
    ...project,
    schemaVersion: 17,
  }
}
