import { useContext } from 'react'
import { SectionTemplateLibraryContext } from './sectionTemplateLibraryContext'

export function useSectionTemplateLibrary() {
  const context = useContext(SectionTemplateLibraryContext)

  if (!context) {
    throw new Error(
      'useSectionTemplateLibrary must be used inside SectionTemplateLibraryProvider.',
    )
  }

  return context
}
