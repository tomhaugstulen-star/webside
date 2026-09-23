import { createStableId } from '../model/createStableId'
import type { EditorProject } from '../model/editorProject'

export function createDuplicateProject(
  project: EditorProject,
  date = new Date(),
): EditorProject {
  const timestamp = date.toISOString()

  return {
    ...project,
    id: createStableId(),
    name: `Kopi av ${project.name}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
