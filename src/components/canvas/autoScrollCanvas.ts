const AUTO_SCROLL_EDGE = 56
const AUTO_SCROLL_STEP = 18

export function autoScrollCanvasNearEdges(
  container: HTMLDivElement,
  clientX: number,
  clientY: number,
) {
  const bounds = container.getBoundingClientRect()
  const left =
    clientX < bounds.left + AUTO_SCROLL_EDGE
      ? -AUTO_SCROLL_STEP
      : clientX > bounds.right - AUTO_SCROLL_EDGE
        ? AUTO_SCROLL_STEP
        : 0
  const top =
    clientY < bounds.top + AUTO_SCROLL_EDGE
      ? -AUTO_SCROLL_STEP
      : clientY > bounds.bottom - AUTO_SCROLL_EDGE
        ? AUTO_SCROLL_STEP
        : 0

  if (left !== 0 || top !== 0) {
    container.scrollBy({ left, top })
  }
}
