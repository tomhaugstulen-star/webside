import type { EditorProjectState } from '../model/editorProject'
import type { EditorProjectAction } from './editorProjectAction'
import { setImageAltText } from './setImageAltText'
import { setImageMode } from './setImageMode'
import { setImageTransform } from './setImageTransform'

export type ImageProjectAction = Extract<
  EditorProjectAction,
  {
    type:
      | 'set-image-alt-text'
      | 'set-image-mode'
      | 'set-image-transform'
  }
>

export function reduceImageProjectAction(
  state: EditorProjectState,
  action: ImageProjectAction,
): EditorProjectState {
  switch (action.type) {
    case 'set-image-alt-text':
      return setImageAltText(
        state,
        action.elementId,
        action.altText,
        action.updatedAt,
      )
    case 'set-image-mode':
      return setImageMode(
        state,
        action.elementId,
        action.mode,
        action.updatedAt,
      )
    case 'set-image-transform':
      return setImageTransform(
        state,
        action.elementId,
        action.transform,
        action.updatedAt,
      )
  }

  const unhandledAction: never = action
  return unhandledAction
}
