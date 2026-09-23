import { useCallback } from 'react'
import { normalizeEditorColor } from '../model/editorColor'
import { isEditorFill, type EditorFill } from '../model/editorFill'
import type { ElementFrameWidth } from '../model/elementFrame'
import type { ImageAssetId, ImageAssetMetadata } from '../model/imageAsset'
import { useEditorProject } from './useEditorProject'

export function useHeroProperties() {
  const { dispatch } = useEditorProject()

  const updateHeroContent = useCallback(
    (
      elementId: string,
      title: string,
      subtitle: string,
      ctaLabel: string,
    ) => {
      dispatch({
        type: 'set-hero-content',
        elementId,
        title,
        subtitle,
        ctaLabel,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateHeroImage = useCallback(
    (
      elementId: string,
      imageAssetId: ImageAssetId,
      imageAssetMetadata: ImageAssetMetadata,
    ) => {
      dispatch({
        type: 'set-hero-image',
        elementId,
        imageAssetId,
        imageAssetMetadata,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateHeroBackgroundFill = useCallback(
    (elementId: string, fill: EditorFill) => {
      if (!isEditorFill(fill)) return false
      dispatch({
        type: 'set-hero-background-fill',
        elementId,
        fill,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateHeroTextColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false
      dispatch({
        type: 'set-hero-text-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  const updateHeroFrameWidth = useCallback(
    (elementId: string, width: ElementFrameWidth) => {
      dispatch({
        type: 'set-hero-frame-width',
        elementId,
        width,
        updatedAt: new Date().toISOString(),
      })
    },
    [dispatch],
  )

  const updateHeroFrameColor = useCallback(
    (elementId: string, value: string) => {
      const color = normalizeEditorColor(value)
      if (!color) return false
      dispatch({
        type: 'set-hero-frame-color',
        elementId,
        color,
        updatedAt: new Date().toISOString(),
      })
      return true
    },
    [dispatch],
  )

  return {
    updateHeroContent,
    updateHeroImage,
    updateHeroBackgroundFill,
    updateHeroTextColor,
    updateHeroFrameWidth,
    updateHeroFrameColor,
  }
}
