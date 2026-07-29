import type { PointerEvent } from 'react'
import type { ResizeHandle } from '../../model/elementLayout'

const imageResizeHandles: ResizeHandle[] = [
  'north-west',
  'north',
  'north-east',
  'east',
  'south-east',
  'south',
  'south-west',
  'west',
]

type ImageResizeHandlesProps = {
  onPointerDown: (
    handle: ResizeHandle,
    event: PointerEvent<HTMLSpanElement>,
  ) => void
}

export function ImageResizeHandles({
  onPointerDown,
}: ImageResizeHandlesProps) {
  return (
    <>
      {imageResizeHandles.map((handle) => (
        <span
          key={handle}
          className={`image-frame-handle image-frame-handle--${handle}`}
          aria-hidden="true"
          onPointerDown={(event) => onPointerDown(handle, event)}
        />
      ))}
    </>
  )
}
