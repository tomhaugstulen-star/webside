import { useEffect } from 'react'
import type { CanvasPosition, EditorElement } from '../../model/editorProject'
import {
  imageTransformsEqual,
  moveImageTransform,
  type ImageTransform,
} from '../../model/imagePresentation'

const keyboardDirections: Partial<Record<string, CanvasPosition>> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

const BLOCKED_CROP_SHORTCUT_SELECTOR = [
  'textarea',
  'select',
  'input:not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"])',
  'dialog',
  '[role="dialog"]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',')

function isBlockedCropShortcutTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(BLOCKED_CROP_SHORTCUT_SELECTOR) !== null
  )
}

type UseSelectedImageCropKeyboardOptions = {
  element: EditorElement | null
  disabled: boolean
  onCommitTransform: (elementId: string, transform: ImageTransform) => void
}

export function useSelectedImageCropKeyboard({
  element,
  disabled,
  onCommitTransform,
}: UseSelectedImageCropKeyboardOptions) {
  useEffect(() => {
    const moveSelectedImageCrop = (event: KeyboardEvent) => {
      const direction = keyboardDirections[event.key]

      if (
        disabled ||
        event.defaultPrevented ||
        event.isComposing ||
        !direction ||
        !event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        !element ||
        element.kind !== 'image' ||
        element.mode !== 'crop' ||
        element.locked ||
        isBlockedCropShortcutTarget(event.target)
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const step = event.shiftKey ? 20 : 4
      const nextTransform = moveImageTransform(
        element.assetMetadata,
        element.size.desktop,
        element.transform,
        direction.x * step,
        direction.y * step,
      )

      if (!imageTransformsEqual(nextTransform, element.transform)) {
        onCommitTransform(element.id, nextTransform)
      }
    }

    window.addEventListener('keydown', moveSelectedImageCrop, true)
    return () => window.removeEventListener('keydown', moveSelectedImageCrop, true)
  }, [disabled, element, onCommitTransform])
}
