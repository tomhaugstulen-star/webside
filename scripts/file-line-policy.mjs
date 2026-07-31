export const ACTIVE_LIMIT = 250
export const HARD_LIMIT = 300

export function countLines(content) {
  if (content.length === 0) {
    return 0
  }

  const normalized = content.replace(/\r\n?/g, '\n')
  const withoutTrailingNewline = normalized.endsWith('\n')
    ? normalized.slice(0, -1)
    : normalized

  return withoutTrailingNewline.length === 0
    ? 1
    : withoutTrailingNewline.split('\n').length
}

export function validateExceptionConfiguration(resultsByPath, exceptions) {
  const errors = []

  for (const [filePath, reason] of exceptions) {
    if (typeof reason !== 'string' || reason.trim().length === 0) {
      errors.push(`${filePath}: unntaket mangler en konkret begrunnelse.`)
      continue
    }

    const result = resultsByPath.get(filePath)

    if (!result) {
      errors.push(`${filePath}: unntaket peker ikke på en kontrollert produksjonsfil.`)
      continue
    }

    if (result.lines < ACTIVE_LIMIT) {
      errors.push(
        `${filePath}: unntaket er foreldet; filen har bare ${result.lines} linjer.`,
      )
    }
  }

  return errors
}

export function findViolations(results, exceptions) {
  const violations = []

  for (const result of results) {
    if (result.lines >= HARD_LIMIT) {
      violations.push(
        `${result.path}: ${result.lines} linjer overskrider hardgrensen på ${HARD_LIMIT - 1}.`,
      )
      continue
    }

    if (result.lines >= ACTIVE_LIMIT && !exceptions.has(result.path)) {
      violations.push(
        `${result.path}: ${result.lines} linjer krever oppdeling eller et eksplisitt begrunnet unntak.`,
      )
    }
  }

  return violations
}
