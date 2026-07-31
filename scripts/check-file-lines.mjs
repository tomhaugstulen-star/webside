import { readdir, readFile } from 'node:fs/promises'
import { relative, resolve, sep } from 'node:path'
import {
  ACTIVE_LIMIT,
  HARD_LIMIT,
  countLines,
  findViolations,
  validateExceptionConfiguration,
} from './file-line-policy.mjs'

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

async function main() {
  const sourceFiles = await collectSourceFiles(SOURCE_ROOT)
  const results = await Promise.all(
    sourceFiles.map(async (filePath) => ({
      path: toRepositoryPath(filePath),
      lines: countLines(await readFile(filePath, 'utf8')),
    })),
  )

  results.sort((left, right) =>
    right.lines === left.lines
      ? left.path.localeCompare(right.path)
      : right.lines - left.lines,
  )

  const resultsByPath = new Map(results.map((result) => [result.path, result]))
  const errors = [
    ...validateExceptionConfiguration(resultsByPath, LINE_LIMIT_EXCEPTIONS),
    ...findViolations(results, LINE_LIMIT_EXCEPTIONS),
  ]

  console.log(
    `Kontrollerte ${results.length} produksjonsfiler (ordinære filer < ${ACTIVE_LIMIT}; absolutt grense < ${HARD_LIMIT} linjer).`,
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
