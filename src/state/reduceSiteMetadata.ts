import type { EditorProjectState } from '../model/editorProject'
import { isValidPageSeo, isValidSiteSettings } from '../model/siteSettings'
import type { EditorProjectAction } from './editorProjectAction'

export function reduceSiteMetadata(state: EditorProjectState,
  action: Extract<EditorProjectAction, { type: 'set-site-metadata' }>): EditorProjectState {
  const page = state.project.pages.find((candidate) => candidate.id === action.pageId)
  if (!action.name.trim() || action.name.trim() !== action.name || action.name.length > 120 ||
    !isValidSiteSettings(action.settings) || !isValidPageSeo(action.seo) ||
    !page) return state
  if (state.project.name === action.name &&
    state.project.siteSettings.language === action.settings.language &&
    state.project.siteSettings.publicUrl === action.settings.publicUrl &&
    page.seo.title === action.seo.title && page.seo.description === action.seo.description) return state
  return { ...state, project: {
    ...state.project, name: action.name, siteSettings: action.settings,
    updatedAt: action.updatedAt,
    pages: state.project.pages.map((page) => page.id === action.pageId
      ? { ...page, seo: action.seo } : page),
  } }
}
