import { isKnownButtonAssetId, normalizeButtonLabel } from '../model/buttonAsset'
import { HEADER_SERIALIZED_WIDTH } from '../model/elementDimensions'
import {
  isValidElementDesktopLayout,
  isValidElementLayout,
} from '../model/elementLayout'
import { isValidElementLink } from '../model/elementLink'
import { isValidHeaderAppearance } from '../model/headerAppearance'
import {
  isValidHeaderSiteName,
  isValidHeaderSubtitle,
} from '../model/headerElement'
import type {
  CanvasPosition,
  EditorElement,
  ElementKind,
  ElementSize,
  ImageEditorElement,
  ResponsiveValue,
} from '../model/editorProject'
import {
  isValidImageAssetMetadata,
  isImageAssetId,
} from '../model/imageAsset'
import {
  imageTransformsEqual,
  isImageMode,
  normalizeImageTransform,
} from '../model/imagePresentation'
import { isValidSectionAppearance } from '../model/sectionAppearance'
import { isValidTextAppearance } from '../model/textAppearance'
import { isValidTextElementStyle } from '../model/textElementStyle'
import {
  hasExactKeys,
  isRecord,
  isStableId,
  isValidPosition,
  isValidResponsiveValue,
  isValidSize,
} from './validationHelpers'

const baseElementKeys = [
  'id',
  'kind',
  'position',
  'size',
  'visibility',
  'locked',
] as const

function getResponsiveLayouts(value: Record<string, unknown>) {
  const positions = value.position as ResponsiveValue<CanvasPosition>
  const sizes = value.size as ResponsiveValue<ElementSize>

  return [
    {
      position: positions.desktop,
      size: sizes.desktop,
    },
    {
      position: positions.mobile ?? positions.desktop,
      size: sizes.mobile ?? sizes.desktop,
    },
  ]
}

function hasValidResponsiveLayout(
  kind: ElementKind,
  value: Record<string, unknown>,
) {
  return getResponsiveLayouts(value).every((layout) =>
    isValidElementLayout(kind, layout),
  )
}

function hasValidBaseElement(
  kind: ElementKind,
  value: Record<string, unknown>,
) {
  return (
    isStableId(value.id) &&
    isValidResponsiveValue<CanvasPosition>(value.position, isValidPosition) &&
    isValidResponsiveValue<ElementSize>(value.size, isValidSize) &&
    isValidResponsiveValue<boolean>(
      value.visibility,
      (candidate) => typeof candidate === 'boolean',
    ) &&
    typeof value.locked === 'boolean' &&
    hasValidResponsiveLayout(kind, value)
  )
}

function isValidSectionElement(value: Record<string, unknown>) {
  return (
    hasExactKeys(value, [...baseElementKeys, 'appearance']) &&
    hasValidBaseElement('section', value) &&
    isValidSectionAppearance(value.appearance)
  )
}

function isValidImageElement(value: Record<string, unknown>) {
  const normalizedTransform = normalizeImageTransform(value.transform)

  if (
    !hasExactKeys(value, [
      ...baseElementKeys,
      'assetId',
      'assetMetadata',
      'altText',
      'mode',
      'transform',
    ]) ||
    !hasValidBaseElement('image', value) ||
    !isImageAssetId(value.assetId) ||
    !isValidImageAssetMetadata(value.assetMetadata) ||
    typeof value.altText !== 'string' ||
    value.altText !== value.altText.trim() ||
    !isImageMode(value.mode) ||
    normalizedTransform === null ||
    !isRecord(value.transform) ||
    !hasExactKeys(value.transform, ['zoom', 'offsetX', 'offsetY']) ||
    !imageTransformsEqual(
      normalizedTransform,
      value.transform as unknown as typeof normalizedTransform,
    )
  ) {
    return false
  }

  const element = value as unknown as ImageEditorElement
  return getResponsiveLayouts(value).every((layout) =>
    isValidElementDesktopLayout(element, layout),
  )
}

function isValidTextElement(value: Record<string, unknown>) {
  return (
    hasExactKeys(value, [
      ...baseElementKeys,
      'content',
      'appearance',
      'textStyle',
      'link',
    ]) &&
    hasValidBaseElement('text', value) &&
    typeof value.content === 'string' &&
    isValidTextAppearance(value.appearance) &&
    isValidTextElementStyle(value.textStyle) &&
    isValidElementLink(value.link)
  )
}

function isValidButtonElement(value: Record<string, unknown>) {
  return (
    hasExactKeys(value, [
      ...baseElementKeys,
      'assetId',
      'label',
      'link',
    ]) &&
    hasValidBaseElement('button', value) &&
    isKnownButtonAssetId(value.assetId) &&
    typeof value.label === 'string' &&
    normalizeButtonLabel(value.label) === value.label &&
    isValidElementLink(value.link)
  )
}

function hasCanonicalHeaderLayouts(value: Record<string, unknown>) {
  return getResponsiveLayouts(value).every(
    ({ position, size }) =>
      position.x === 0 &&
      position.y === 0 &&
      size.width === HEADER_SERIALIZED_WIDTH,
  )
}

function isValidHeaderElement(value: Record<string, unknown>) {
  return (
    hasExactKeys(value, [
      ...baseElementKeys,
      'logoAssetId',
      'logoAssetMetadata',
      'siteName',
      'subtitle',
      'appearance',
    ]) &&
    hasValidBaseElement('header', value) &&
    hasCanonicalHeaderLayouts(value) &&
    isImageAssetId(value.logoAssetId) &&
    isValidImageAssetMetadata(value.logoAssetMetadata) &&
    typeof value.siteName === 'string' &&
    isValidHeaderSiteName(value.siteName) &&
    typeof value.subtitle === 'string' &&
    isValidHeaderSubtitle(value.subtitle) &&
    isValidHeaderAppearance(value.appearance)
  )
}

export function isValidEditorElement(
  value: unknown,
): value is EditorElement {
  if (!isRecord(value) || typeof value.kind !== 'string') {
    return false
  }

  switch (value.kind) {
    case 'section':
      return isValidSectionElement(value)
    case 'image':
      return isValidImageElement(value)
    case 'text':
      return isValidTextElement(value)
    case 'button':
      return isValidButtonElement(value)
    case 'header':
      return isValidHeaderElement(value)
    default:
      return false
  }
}
