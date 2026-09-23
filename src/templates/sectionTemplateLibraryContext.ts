import { createContext } from 'react'
import type { SectionTemplate } from './sectionTemplate'

export type SectionTemplateLibraryStatus = 'loading' | 'ready' | 'error'
export type SaveSectionTemplateResult =
  | 'saved'
  | 'invalid-name'
  | 'section-missing'
  | 'asset-missing'
  | 'storage-error'
export type InsertSectionTemplateResult =
  | 'inserted'
  | 'not-found'
  | 'invalid-template'
  | 'asset-error'

export type SectionTemplateLibraryContextValue = {
  templates: SectionTemplate[]
  status: SectionTemplateLibraryStatus
  saveSectionTemplate: (
    sectionId: string,
    name: string,
  ) => Promise<SaveSectionTemplateResult>
  insertSectionTemplate: (
    templateId: string,
  ) => Promise<InsertSectionTemplateResult>
  deleteSectionTemplate: (templateId: string) => Promise<boolean>
}

export const SectionTemplateLibraryContext =
  createContext<SectionTemplateLibraryContextValue | null>(null)
