import type { ResponsiveValue } from './editorProject'

export type ResponsiveViewport = 'desktop' | 'mobile'

export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  viewport: ResponsiveViewport,
) {
  return viewport === 'mobile' ? (value.mobile ?? value.desktop) : value.desktop
}
