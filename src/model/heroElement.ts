export const MAX_HERO_TITLE_LENGTH = 120
export const MAX_HERO_SUBTITLE_LENGTH = 240
export const MAX_HERO_CTA_LABEL_LENGTH = 60

export const DEFAULT_HERO_TITLE = 'Din overskrift'
export const DEFAULT_HERO_SUBTITLE = 'Skriv en kort introduksjon her.'
export const DEFAULT_HERO_CTA_LABEL = 'Les mer'

export function normalizeHeroText(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidHeroTitle(value: string) {
  return (
    normalizeHeroText(value) === value &&
    value.length > 0 &&
    value.length <= MAX_HERO_TITLE_LENGTH
  )
}

export function isValidHeroSubtitle(value: string) {
  return (
    normalizeHeroText(value) === value &&
    value.length <= MAX_HERO_SUBTITLE_LENGTH
  )
}

export function isValidHeroCtaLabel(value: string) {
  return (
    normalizeHeroText(value) === value &&
    value.length > 0 &&
    value.length <= MAX_HERO_CTA_LABEL_LENGTH
  )
}
