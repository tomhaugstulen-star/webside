import { isKnownButtonAssetId, normalizeButtonLabel } from './buttonAsset'
import type {
  EditorElement,
  ResponsiveValue,
} from './editorProject'
import { isValidElementLayout, isValidElementDesktopLayout } from './elementLayout'
import { HEADER_SERIALIZED_WIDTH } from './elementDimensions'
import { isValidElementLink } from './elementLink'
import { isValidHeaderAppearance } from './headerAppearance'
import { isValidHeaderSiteName, isValidHeaderSubtitle } from './headerElement'
import { isValidHeroAppearance } from './heroAppearance'
import {
  isValidHeroCtaLabel,
  isValidHeroSubtitle,
  isValidHeroTitle,
} from './heroElement'
import {
  isImageAssetId,
  isValidImageAssetMetadata,
} from './imageAsset'
import {
  isImageMode,
  normalizeImageTransform,
  type ImageTransform,
} from './imagePresentation'
import { isValidSectionAppearance } from './sectionAppearance'
import { isValidTextAppearance } from './textAppearance'
import { isValidTextElementStyle } from './textElementStyle'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actual = Object.keys(value)
  return actual.length === keys.length && actual.every((key) => keys.includes(key))
}

function isReference(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.trim() === value
}

function isPosition(value: unknown) {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['x', 'y']) &&
    typeof value.x === 'number' &&
    Number.isFinite(value.x) &&
    typeof value.y === 'number' &&
    Number.isFinite(value.y)
  )
}

function isSize(value: unknown) {
  return (
    isRecord(value) &&
    hasExactKeys(value, ['width', 'height']) &&
    typeof value.width === 'number' &&
    Number.isFinite(value.width) &&
    typeof value.height === 'number' &&
    Number.isFinite(value.height)
  )
}

function isResponsiveValue(
  value: unknown,
  validator: (candidate: unknown) => boolean,
): value is ResponsiveValue<unknown> {
  if (!isRecord(value)) return false
  const keys = Object.keys(value)
  return (
    keys.every((key) => key === 'desktop' || key === 'mobile') &&
    keys.includes('desktop') &&
    validator(value.desktop) &&
    (value.mobile === undefined || validator(value.mobile))
  )
}

function hasValidLayouts(element: Record<string, unknown>, kind: EditorElement['kind']) {
  if (
    !isResponsiveValue(element.position, isPosition) ||
    !isResponsiveValue(element.size, isSize) ||
    !isResponsiveValue(element.visibility, (value) => typeof value === 'boolean')
  ) {
    return false
  }

  const positions = element.position as ResponsiveValue<{ x: number; y: number }>
  const sizes = element.size as ResponsiveValue<{ width: number; height: number }>
  const desktopValid = isValidElementLayout(kind, {
    position: positions.desktop,
    size: sizes.desktop,
  })
  const mobileValid = isValidElementLayout(kind, {
    position: positions.mobile ?? positions.desktop,
    size: sizes.mobile ?? sizes.desktop,
  })

  if (kind === 'header') {
    return desktopValid && mobileValid && element.locked === false &&
      [positions.desktop, positions.mobile ?? positions.desktop].every(
        ({ x, y }) => x === 0 && y === 0,
      ) && [sizes.desktop, sizes.mobile ?? sizes.desktop].every(
        ({ width }) => width === HEADER_SERIALIZED_WIDTH,
      )
  }

  return desktopValid && mobileValid
}

function isExactImageTransform(value: unknown): value is ImageTransform {
  const normalized = normalizeImageTransform(value)
  if (!normalized || !isRecord(value)) return false

  return (
    hasExactKeys(value, ['zoom', 'offsetX', 'offsetY']) &&
    value.zoom === normalized.zoom &&
    value.offsetX === normalized.offsetX &&
    value.offsetY === normalized.offsetY
  )
}

function hasValidImageCropLayouts(element: EditorElement) {
  return ['desktop', 'mobile'].every((viewport) => {
    const mobile = viewport === 'mobile'
    return isValidElementDesktopLayout(element, {
      position: (mobile && element.position.mobile) || element.position.desktop,
      size: (mobile && element.size.mobile) || element.size.desktop,
    })
  })
}

function hasValidCommonFields(
  element: Record<string, unknown>,
  kind: EditorElement['kind'],
) {
  return (
    isReference(element.id) &&
    element.kind === kind &&
    typeof element.locked === 'boolean' &&
    (element.displayName === undefined ||
      (typeof element.displayName === 'string' &&
        element.displayName.length <= 60 &&
        element.displayName.trim() === element.displayName)) &&
    hasValidLayouts(element, kind)
  )
}

export function isValidEditorElement(value: unknown): value is EditorElement {
  if (!isRecord(value) || typeof value.kind !== 'string') return false

  switch (value.kind) {
    case 'section':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          ...(value.displayName === undefined ? [] : ['displayName']),
          'kind', 'anchorId', 'appearance',
        ]) &&
        hasValidCommonFields(value, 'section') &&
        typeof value.anchorId === 'string' &&
        isValidSectionAppearance(value.appearance)
      )
    case 'image':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          ...(value.displayName === undefined ? [] : ['displayName']), 'kind',
          'assetId', 'assetMetadata', 'altText', 'mode', 'transform',
        ]) &&
        hasValidCommonFields(value, 'image') &&
        isImageAssetId(value.assetId) &&
        isValidImageAssetMetadata(value.assetMetadata) &&
        typeof value.altText === 'string' &&
        isImageMode(value.mode) &&
        isExactImageTransform(value.transform) &&
        hasValidImageCropLayouts(value as unknown as EditorElement)
      )
    case 'text':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          ...(value.displayName === undefined ? [] : ['displayName']), 'kind',
          'content', 'appearance', 'textStyle', 'link',
        ]) &&
        hasValidCommonFields(value, 'text') &&
        typeof value.content === 'string' &&
        isValidTextAppearance(value.appearance) &&
        isValidTextElementStyle(value.textStyle) &&
        isValidElementLink(value.link)
      )
    case 'button':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          ...(value.displayName === undefined ? [] : ['displayName']),
          'kind', 'assetId', 'label', 'link',
          ...(value.dropdown === undefined ? [] : ['dropdown']),
        ]) &&
        hasValidCommonFields(value, 'button') &&
        isKnownButtonAssetId(value.assetId) &&
        typeof value.label === 'string' &&
        normalizeButtonLabel(value.label) === value.label &&
        isValidElementLink(value.link) &&
        (value.dropdown === undefined || typeof value.dropdown === 'boolean') &&
        (value.dropdown !== true || value.link.type === 'none')
      )
    case 'header':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          ...(value.displayName === undefined ? [] : ['displayName']), 'kind',
          'logoAssetId', 'logoAssetMetadata', 'siteName', 'subtitle', 'appearance',
        ]) &&
        hasValidCommonFields(value, 'header') &&
        isImageAssetId(value.logoAssetId) &&
        isValidImageAssetMetadata(value.logoAssetMetadata) &&
        typeof value.siteName === 'string' &&
        isValidHeaderSiteName(value.siteName) &&
        typeof value.subtitle === 'string' &&
        isValidHeaderSubtitle(value.subtitle) &&
        isValidHeaderAppearance(value.appearance)
      )
    case 'hero':
      return (
        hasExactKeys(value, [
          'id', 'position', 'size', 'visibility', 'locked',
          ...(value.displayName === undefined ? [] : ['displayName']), 'kind',
          'imageAssetId', 'imageAssetMetadata', 'title', 'subtitle',
          'ctaLabel', 'ctaLink', 'appearance',
        ]) &&
        hasValidCommonFields(value, 'hero') &&
        isImageAssetId(value.imageAssetId) &&
        isValidImageAssetMetadata(value.imageAssetMetadata) &&
        typeof value.title === 'string' &&
        isValidHeroTitle(value.title) &&
        typeof value.subtitle === 'string' &&
        isValidHeroSubtitle(value.subtitle) &&
        typeof value.ctaLabel === 'string' &&
        isValidHeroCtaLabel(value.ctaLabel) &&
        isValidElementLink(value.ctaLink) &&
        isValidHeroAppearance(value.appearance)
      )
    default:
      return false
  }
}
