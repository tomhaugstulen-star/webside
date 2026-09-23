import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useImageAssetStore } from '../assets/images/useImageAssetStore'
import { createStableId } from '../model/createStableId'
import { isValidEditorProject } from '../model/editorProjectValidation'
import { useEditorProject } from '../state/useEditorProject'
import { captureSectionTemplate } from './captureSectionTemplate'
import { instantiateSectionTemplate } from './instantiateSectionTemplate'
import {
  normalizeSectionTemplateName,
  type SectionTemplate,
} from './sectionTemplate'
import {
  SectionTemplateLibraryContext,
  type InsertSectionTemplateResult,
  type SaveSectionTemplateResult,
  type SectionTemplateLibraryStatus,
} from './sectionTemplateLibraryContext'
import { sectionTemplateStorage } from './sectionTemplateStorage'

export function SectionTemplateLibraryProvider({
  children,
}: PropsWithChildren) {
  const { state, activePage, dispatch } = useEditorProject()
  const { getImageAsset, registerImageAsset, removeImageAsset } =
    useImageAssetStore()
  const [templates, setTemplates] = useState<SectionTemplate[]>([])
  const [status, setStatus] =
    useState<SectionTemplateLibraryStatus>('loading')

  useEffect(() => {
    let active = true

    void sectionTemplateStorage
      .loadAll()
      .then((loaded) => {
        if (!active) return
        setTemplates(loaded)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const saveSectionTemplate = useCallback(
    async (
      sectionId: string,
      rawName: string,
    ): Promise<SaveSectionTemplateResult> => {
      const name = normalizeSectionTemplateName(rawName)
      if (!name || name.length > 80) return 'invalid-name'

      const template = captureSectionTemplate(
        activePage,
        sectionId,
        {
          id: createStableId(),
          name,
          createdAt: new Date().toISOString(),
        },
        getImageAsset,
      )

      if (!template) {
        return activePage.elements.some(
          (element) => element.id === sectionId && element.kind === 'section',
        )
          ? 'asset-missing'
          : 'section-missing'
      }

      try {
        await sectionTemplateStorage.save(template)
        setTemplates((current) => [template, ...current])
        setStatus('ready')
        return 'saved'
      } catch {
        setStatus('error')
        return 'storage-error'
      }
    },
    [activePage, getImageAsset],
  )

  const insertSectionTemplate = useCallback(
    async (templateId: string): Promise<InsertSectionTemplateResult> => {
      const template = templates.find((candidate) => candidate.id === templateId)
      if (!template) return 'not-found'

      const insertion = instantiateSectionTemplate(
        template,
        activePage.elements,
      )
      if (!insertion) return 'invalid-template'

      const pages = state.project.pages.map((page) =>
        page.id === state.activePageId
          ? { ...page, elements: [...page.elements, ...insertion.elements] }
          : page,
      )
      const updatedAt = new Date().toISOString()
      const candidateProject = { ...state.project, pages, updatedAt }

      if (!isValidEditorProject(candidateProject)) return 'invalid-template'

      const registeredIds: string[] = []
      for (const asset of insertion.assets) {
        if (
          !registerImageAsset(asset.assetId, asset.file, asset.metadata)
        ) {
          registeredIds.forEach(removeImageAsset)
          return 'asset-error'
        }
        registeredIds.push(asset.assetId)
      }

      dispatch({
        type: 'insert-elements-to-active-page',
        elements: insertion.elements,
        selectedElementId: insertion.selectedElementId,
        updatedAt,
      })
      return 'inserted'
    },
    [
      activePage.elements,
      dispatch,
      registerImageAsset,
      removeImageAsset,
      state.activePageId,
      state.project,
      templates,
    ],
  )

  const deleteSectionTemplate = useCallback(async (templateId: string) => {
    try {
      await sectionTemplateStorage.remove(templateId)
      setTemplates((current) =>
        current.filter((template) => template.id !== templateId),
      )
      return true
    } catch {
      setStatus('error')
      return false
    }
  }, [])

  const value = useMemo(
    () => ({
      templates,
      status,
      saveSectionTemplate,
      insertSectionTemplate,
      deleteSectionTemplate,
    }),
    [
      deleteSectionTemplate,
      insertSectionTemplate,
      saveSectionTemplate,
      status,
      templates,
    ],
  )

  return (
    <SectionTemplateLibraryContext.Provider value={value}>
      {children}
    </SectionTemplateLibraryContext.Provider>
  )
}
