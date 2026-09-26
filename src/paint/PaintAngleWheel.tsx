import { useRef, type PointerEvent } from 'react'

type Props = {
  angle: number
  disabled: boolean
  onChange: (angle: number) => void
}

export function PaintAngleWheel({ angle, disabled, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const update = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds || disabled) return
    const x = event.clientX - (bounds.left + bounds.width / 2)
    const y = event.clientY - (bounds.top + bounds.height / 2)
    const degrees = (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360
    onChange(Math.round(degrees))
  }

  return (
    <div className="paint-angle-control">
      <div ref={ref} className="paint-angle-wheel"
        role="slider" aria-label="Gradientvinkel" aria-valuemin={0}
        aria-valuemax={360} aria-valuenow={angle} tabIndex={disabled ? -1 : 0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          update(event)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event)
        }}>
        <span className="paint-angle-wheel__hand"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} />
      </div>
      <input type="number" min="0" max="360" step="1" value={angle}
        disabled={disabled} aria-label="Gradientvinkel i grader"
        onChange={(event) => onChange(
          Math.max(0, Math.min(360, Number(event.target.value) || 0)),
        )} />
      <span>°</span>
    </div>
  )
}
