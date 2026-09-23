import type { ProjectFileReadErrorCode } from './readProjectFile'

const messages: Record<ProjectFileReadErrorCode, string> = {
  'invalid-json': 'Prosjektfilen inneholder ugyldig JSON.',
  'invalid-envelope': 'Prosjektfilen har ugyldig format.',
  'unsupported-format-version': 'Prosjektfilen bruker en formatversjon som ikke støttes.',
  'invalid-project': 'Prosjektdataene er ugyldige eller kan ikke migreres.',
  'invalid-asset': 'Prosjektfilen inneholder en ugyldig bildefil.',
  'duplicate-asset': 'Prosjektfilen inneholder dupliserte bildefiler.',
  'missing-asset': 'Prosjektfilen mangler en bildefil som prosjektet bruker.',
  'asset-mismatch': 'En bildefil samsvarer ikke med lagrede metadata.',
}

export function getProjectFileErrorMessage(error: ProjectFileReadErrorCode) {
  return messages[error]
}
