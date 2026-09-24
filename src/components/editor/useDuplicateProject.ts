import { useCallback } from 'react'
import { useImageAssetStore } from '../../assets/images/useImageAssetStore'
import type { EditorProject } from '../../model/editorProject'
import { downloadDuplicateProject } from '../../projectFiles/downloadDuplicateProject'

export function useDuplicateProject(project: EditorProject) {
  const { getImageAsset } = useImageAssetStore()
  return useCallback(() => {
    void downloadDuplicateProject(project, getImageAsset)
      .then((created) => {
        if (!created) window.alert('Prosjektkopien kunne ikke opprettes. Kontroller bildene.')
      })
      .catch(() => window.alert('Prosjektkopien kunne ikke opprettes.'))
  }, [getImageAsset, project])
}
