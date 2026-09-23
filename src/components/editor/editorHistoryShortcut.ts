function isNativeUndoTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  )
}

export function getEditorHistoryShortcut(event: KeyboardEvent) {
  if (isNativeUndoTarget(event.target) || event.altKey) return null

  const modifier = event.ctrlKey || event.metaKey
  if (!modifier) return null

  const key = event.key.toLowerCase()

  if (key === 'z') {
    return event.shiftKey ? 'redo' : 'undo'
  }

  if (key === 'y' && event.ctrlKey && !event.metaKey && !event.shiftKey) {
    return 'redo'
  }

  return null
}
