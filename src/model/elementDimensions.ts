export type ElementKind = 'section' | 'image' | 'text' | 'button' | 'header'

export type ElementSize = {
  width: number
  height: number
}

export type ElementMaximumSize = {
  width?: number
  height?: number
}

export const IMAGE_CROP_BASE_FRAME_SIZE_V6 = {
  width: 240,
  height: 160,
} as const satisfies ElementSize

export const HEADER_SERIALIZED_WIDTH = 960
export const HEADER_DEFAULT_HEIGHT = 88
export const HEADER_MINIMUM_HEIGHT = 70
export const HEADER_MAXIMUM_HEIGHT = 100

const defaultElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 320, height: 180 },
  image: { ...IMAGE_CROP_BASE_FRAME_SIZE_V6 },
  text: { width: 240, height: 96 },
  button: { width: 160, height: 48 },
  header: { width: HEADER_SERIALIZED_WIDTH, height: HEADER_DEFAULT_HEIGHT },
}

const minimumElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 160, height: 90 },
  image: { width: 120, height: 80 },
  text: { width: 120, height: 48 },
  button: { width: 80, height: 36 },
  header: { width: 240, height: HEADER_MINIMUM_HEIGHT },
}

const maximumElementSizes: Partial<Record<ElementKind, ElementMaximumSize>> = {
  header: { height: HEADER_MAXIMUM_HEIGHT },
}

export function getDefaultElementSize(kind: ElementKind): ElementSize {
  return { ...defaultElementSizes[kind] }
}

export function getMinimumElementSize(kind: ElementKind): ElementSize {
  return { ...minimumElementSizes[kind] }
}

export function getMaximumElementSize(kind: ElementKind): ElementMaximumSize | null {
  const maximumSize = maximumElementSizes[kind]
  return maximumSize ? { ...maximumSize } : null
}
