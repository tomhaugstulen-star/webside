export const headerWidthModes = ['custom', 'full'] as const

export type HeaderWidthMode = (typeof headerWidthModes)[number]

export const DEFAULT_HEADER_WIDTH_MODE: HeaderWidthMode = 'custom'

export function isHeaderWidthMode(value: unknown): value is HeaderWidthMode {
  return headerWidthModes.includes(value as HeaderWidthMode)
}
