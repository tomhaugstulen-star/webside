import type { CapturedSiteLayout } from './genericSiteComputedLayout'
import type { ImportedBox } from './genericSiteLayout'

type HeightMapper = (height: number) => number

export function responsiveImportedLayout(
  desktop: ImportedBox,
  mobile: CapturedSiteLayout | null,
  minimum: { width: number; height: number },
  mapHeight: HeightMapper = (height) => height,
) {
  const position = {
    desktop: { x: desktop.x, y: desktop.y },
    ...(mobile
      ? { mobile: { x: mobile.box.x, y: mobile.box.y } }
      : {}),
  }
  const size = {
    desktop: {
      width: Math.max(minimum.width, desktop.width),
      height: Math.max(minimum.height, mapHeight(desktop.height)),
    },
    ...(mobile
      ? {
          mobile: {
            width: Math.max(minimum.width, mobile.box.width),
            height: Math.max(minimum.height, mapHeight(mobile.box.height)),
          },
        }
      : {}),
  }
  return { position, size }
}
