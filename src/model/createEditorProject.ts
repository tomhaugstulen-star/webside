import {
  EDITOR_PROJECT_SCHEMA_VERSION,
  type EditorPage,
  type EditorProject,
  type EditorProjectState,
} from './editorProject'

function createStableId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error('Secure ID generation is not available in this environment.')
  }

  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`
}

export function createBlankPage(name = 'Forside', slug = '/'): EditorPage {
  return {
    id: createStableId(),
    name,
    slug,
    elements: [],
  }
}

export function createBlankProject(name = 'Nytt prosjekt'): EditorProject {
  const createdAt = new Date().toISOString()
  const firstPage = createBlankPage()

  return {
    schemaVersion: EDITOR_PROJECT_SCHEMA_VERSION,
    id: createStableId(),
    name,
    pages: [firstPage],
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
