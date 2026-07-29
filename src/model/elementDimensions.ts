export type ElementKind = 'section' | 'image' | 'text' | 'button'

export type ElementSize = {
  width: number
  height: number
}

export const IMAGE_CROP_BASE_FRAME_SIZE_V6 = {
  width: 240,
  height: 160,
} as const satisfies ElementSize

const defaultElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 320, height: 180 },
  image: { ...IMAGE_CROP_BASE_FRAME_SIZE_V6 },
  text: { width: 240, height: 96 },
  button: { width: 160, height: 48 },
}

const minimumElementSizes: Record<ElementKind, ElementSize> = {
  section: { width: 160, height: 90 },
  image: { width: 120, height: 80 },
  text: { width: 120, height: 48 },
  button: { width: 80, height: 36 },
}

export function getDefaultElementSize(kind: ElementKind): ElementSize {
  return { ...defaultElementSizes[kind] }
}

export function getMinimumElementSize(kind: ElementKind): ElementSize {
  return { ...minimumElementSizes[kind] }
}
