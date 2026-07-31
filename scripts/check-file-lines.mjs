import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve, sep } from 'node:path'

const ACTIVE_LIMIT = 250
const HARD_LIMIT = 300
const REPORT_COUNT = 10
const SOURCE_ROOT = resolve('src')
const SOURCE_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.ts', '.tsx'])

// Every exception requires a reviewed code change and a concrete reason.
// Exceptions may use 250–299 lines. No file may reach 300 lines.
const LINE_LIMIT_EXCEPTIONS = new Map([])

function getExtension(filePath) {
  const fileName = filePath.split(/[\\/]/).at(-1) ?? ''
  const extensionIndex = fileName.lastIndexOf('.')
  return extensionIndex >= 0 ? fileName.slice(extensionIndex) : ''
}

function toRepositoryPath(filePath) {
  return relative(process.cwd(), filePath).split(sep).join('/')
}

function countLines(content) {
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

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(entryPath)))
      continue
    }

    if (entry.isFile() && SOURCE_EXTENSIONS.has(getExtension(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

function validateExceptionConfiguration(resultsByPath) {
  const errors = []

  for (const [filePath, reason] of LINE_LIMIT_EXCEPTIONS) {
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

function findViolations(results) {
  const violations = []

  for (const result of results) {
    if (result.lines >= HARD_LIMIT) {
      violations.push(
        `${result.path}: ${result.lines} linjer overskrider hardgrensen på ${HARD_LIMIT - 1}.`,
      )
      continue
    }

    if (
      result.lines >= ACTIVE_LIMIT &&
      !LINE_LIMIT_EXCEPTIONS.has(result.path)
    ) {
      violations.push(
        `${result.path}: ${result.lines} linjer krever oppdeling eller et eksplisitt begrunnet unntak.`,
      )
    }
  }

  return violations
}

async function main() {
  const sourceFiles = await collectSourceFiles(SOURCE_ROOT)
  const results = await Promise.all(
    sourceFiles.map(async (filePath) => {
      const content = await readFile(filePath, 'utf8')
      return {
        path: toRepositoryPath(filePath),
        lines: countLines(content),
      }
    }),
  )

  results.sort((left, right) =>
    right.lines === left.lines
      ? left.path.localeCompare(right.path)
      : right.lines - left.lines,
  )

  const resultsByPath = new Map(results.map((result) => [result.path, result]))
  const errors = [
    ...validateExceptionConfiguration(resultsByPath),
    ...findViolations(results),
  ]

  console.log(
    `Kontrollerte ${results.length} produksjonsfiler (aktiv grense: ${ACTIVE_LIMIT - 1}, hard grense: ${HARD_LIMIT - 1} linjer).`,
  )
  console.log(`Største ${Math.min(REPORT_COUNT, results.length)} filer:`)

  for (const result of results.slice(0, REPORT_COUNT)) {
    const exception = LINE_LIMIT_EXCEPTIONS.has(result.path) ? ' (unntak)' : ''
    console.log(`${String(result.lines).padStart(4)}  ${result.path}${exception}`)
  }

  if (errors.length > 0) {
    console.error('\nFilstørrelseskontrollen feilet:')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log('\n✔ Alle produksjonsfiler er innenfor filstørrelsesgrensene.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
