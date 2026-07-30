const EDITOR_COLOR_PATTERN = /^#[0-9A-F]{6}$/

declare const editorColorBrand: unique symbol

export type EditorColor = string & {
  readonly [editorColorBrand]: true
}

export function normalizeEditorColor(value: string): EditorColor | null {
  const normalized = value.trim().toUpperCase()
  return EDITOR_COLOR_PATTERN.test(normalized)
    ? (normalized as EditorColor)
    : null
}

export function isEditorColor(value: unknown): value is EditorColor {
  return typeof value === 'string' && EDITOR_COLOR_PATTERN.test(value)
}

export function createEditorColor(value: string): EditorColor {
  const normalized = normalizeEditorColor(value)

  if (!normalized) {
    throw new Error(`Invalid editor color: ${value}`)
  }

  return normalized
}
