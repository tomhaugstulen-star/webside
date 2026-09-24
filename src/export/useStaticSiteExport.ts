import { useState } from 'react'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import type { EditorProject } from '../model/editorProject'
import { downloadProjectBlob } from '../projectFiles/downloadProjectBlob'
import { createStaticSiteZip } from './createStaticSite'

export function useStaticSiteExport(project: EditorProject) {
  const { getImageAsset } = useImageAssetStore()
  const [exporting, setExporting] = useState(false)
  const [exportMessage, setExportMessage] = useState<string | null>(null)
  const exportSite = async () => {
    if (exporting) return
    setExporting(true); setExportMessage(null)
    try {
      const blob = await createStaticSiteZip(project, getImageAsset)
      const fileName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'nettsted'
      downloadProjectBlob(blob, `${fileName}-nettside.zip`)
      setExportMessage('Nettstedet er eksportert. Pakk ut ZIP-filen og last opp innholdet til webhotellet.')
    } catch (error) {
      setExportMessage(error instanceof Error ? error.message : 'Nettstedet kunne ikke eksporteres.')
    } finally { setExporting(false) }
  }
  return { exporting, exportMessage, setExportMessage, exportSite }
}
