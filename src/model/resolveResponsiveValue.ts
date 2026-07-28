import type { ResponsiveValue, ResponsiveViewport } from './editorProject'

export function resolveResponsiveValue<T>(
  value: ResponsiveValue<T>,
  viewport: ResponsiveViewport,
) {
  return viewport === 'mobile' ? (value.mobile ?? value.desktop) : value.desktop
}
