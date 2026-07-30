export const MAX_HEADER_SITE_NAME_LENGTH = 80
export const MAX_HEADER_SUBTITLE_LENGTH = 120

export function normalizeHeaderText(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidHeaderSiteName(value: string) {
  return (
    value === normalizeHeaderText(value) &&
    value.length > 0 &&
    value.length <= MAX_HEADER_SITE_NAME_LENGTH
  )
}

export function isValidHeaderSubtitle(value: string) {
  return (
    value === normalizeHeaderText(value) &&
    value.length <= MAX_HEADER_SUBTITLE_LENGTH
  )
}
