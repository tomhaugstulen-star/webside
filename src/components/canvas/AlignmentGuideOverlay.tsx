import type { CSSProperties } from 'react'
import type { AlignmentGuide } from './alignmentGuideTypes'

type AlignmentGuideOverlayProps = {
  guides: AlignmentGuide[]
}

function getGuideStyle(guide: AlignmentGuide): CSSProperties {
  if (guide.axis === 'x') {
    return {
      left: guide.coordinate,
      top: guide.start,
      height: Math.max(0, guide.end - guide.start),
    }
  }

  return {
    left: guide.start,
    top: guide.coordinate,
    width: Math.max(0, guide.end - guide.start),
  }
}

export function AlignmentGuideOverlay({ guides }: AlignmentGuideOverlayProps) {
  if (guides.length === 0) {
    return null
  }

  return (
    <div className="alignment-guide-overlay" aria-hidden="true">
      {guides.map((guide, index) => (
        <span
          key={`${guide.axis}-${guide.coordinate}-${guide.targetElementId ?? guide.source}-${index}`}
          className={`alignment-guide alignment-guide--${guide.axis}`}
          style={getGuideStyle(guide)}
        />
      ))}
    </div>
  )
}
