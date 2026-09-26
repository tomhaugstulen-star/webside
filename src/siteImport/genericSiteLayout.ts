import { cssPixel } from './genericSiteCss'

export type ImportedBox = {
  x: number
  y: number
  width: number
  height: number
}

type CssMap = Map<string, string>

function spacing(css: CssMap, prefix: 'margin' | 'padding') {
  const direct = css.get(prefix)?.trim().split(/\s+/) ?? []
  const values = direct.map((value) => cssPixel(value) ?? 0)
  const [a = 0, b = a, c = a, d = b] = values
  return {
    top: cssPixel(css.get(`${prefix}-top`)) ?? a,
    right: cssPixel(css.get(`${prefix}-right`)) ?? b,
    bottom: cssPixel(css.get(`${prefix}-bottom`)) ?? c,
    left: cssPixel(css.get(`${prefix}-left`)) ?? d,
  }
}

export function importedBox(
  css: CssMap,
  fallback: ImportedBox,
): ImportedBox {
  const margin = spacing(css, 'margin')
  const width = Math.max(40, cssPixel(css.get('width')) ?? fallback.width)
  const height = Math.max(32, cssPixel(css.get('height')) ?? fallback.height)
  return {
    x: Math.max(0, (cssPixel(css.get('left')) ?? fallback.x) + margin.left),
    y: Math.max(0, (cssPixel(css.get('top')) ?? fallback.y) + margin.top),
    width,
    height,
  }
}

function gridColumnCount(value: string | undefined) {
  if (!value) return 1
  const repeat = value.match(/repeat\(\s*(\d+)\s*,/i)
  if (repeat) return Math.max(1, Number(repeat[1]))
  const tokens = value.trim().split(/\s+/).filter(Boolean)
  return Math.max(1, tokens.length)
}

export function childBoxInContainer(
  childCss: CssMap,
  parentCss: CssMap,
  index: number,
  fallbackY: number,
  defaultSize: { width: number; height: number },
): ImportedBox {
  const padding = spacing(parentCss, 'padding')
  const gap = Math.max(0, cssPixel(parentCss.get('gap')) ??
    cssPixel(parentCss.get('column-gap')) ?? 0)
  const parentX = Math.max(0, cssPixel(parentCss.get('left')) ?? 80)
  const parentY = Math.max(0, cssPixel(parentCss.get('top')) ?? fallbackY)
  const parentWidth = Math.max(80, cssPixel(parentCss.get('width')) ?? 1160)
  const display = parentCss.get('display')?.toLowerCase()

  if (display === 'flex') {
    const direction = parentCss.get('flex-direction')?.toLowerCase() ?? 'row'
    if (direction.startsWith('column')) {
      return importedBox(childCss, {
        x: parentX + padding.left,
        y: parentY + padding.top + index * (defaultSize.height + gap),
        width: Math.min(defaultSize.width, parentWidth - padding.left - padding.right),
        height: defaultSize.height,
      })
    }
    const count = Math.max(1, Number(parentCss.get('--import-child-count')) || 1)
    const available = parentWidth - padding.left - padding.right - gap * (count - 1)
    const width = Math.max(40, Math.floor(available / count))
    return importedBox(childCss, {
      x: parentX + padding.left + index * (width + gap),
      y: parentY + padding.top,
      width,
      height: defaultSize.height,
    })
  }

  if (display === 'grid') {
    const columns = gridColumnCount(parentCss.get('grid-template-columns'))
    const available = parentWidth - padding.left - padding.right - gap * (columns - 1)
    const width = Math.max(40, Math.floor(available / columns))
    const column = index % columns
    const row = Math.floor(index / columns)
    return importedBox(childCss, {
      x: parentX + padding.left + column * (width + gap),
      y: parentY + padding.top + row * (defaultSize.height + gap),
      width,
      height: defaultSize.height,
    })
  }

  return importedBox(childCss, {
    x: 80 + padding.left,
    y: fallbackY + padding.top,
    width: defaultSize.width,
    height: defaultSize.height,
  })
}
