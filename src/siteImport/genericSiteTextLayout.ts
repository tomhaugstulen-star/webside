export function importedTextBoxHeight(
  measuredHeight: number,
  minimumHeight = 48,
) {
  // The editor adds its own border/padding around text. Keep the original
  // browser-measured text height plus a small safety margin so wrapped lines
  // do not get clipped after font mapping.
  return Math.max(minimumHeight, Math.ceil(measuredHeight) + 10)
}
