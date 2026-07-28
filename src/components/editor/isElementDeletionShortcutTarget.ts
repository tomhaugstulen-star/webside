const BLOCKED_DELETION_SHORTCUT_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button',
  'a[href]',
  'dialog',
  '[role="dialog"]',
  '[contenteditable]:not([contenteditable="false"])',
  '[data-prevent-element-deletion-shortcut]',
].join(',')

export function isElementDeletionShortcutTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(BLOCKED_DELETION_SHORTCUT_SELECTOR) !== null
  )
}
