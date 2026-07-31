import { spawn, spawnSync } from 'node:child_process'
import { once } from 'node:events'
import { resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const host = '127.0.0.1'
const port = 4173
const baseURL = `http://${host}:${port}`
const viteCli = resolve('node_modules/vite/bin/vite.js')
const playwrightCli = resolve('node_modules/@playwright/test/cli.js')
const managedProcesses = new Set()
let shuttingDown = false

function startNodeProcess(script, arguments_, options = {}) {
  const child = spawn(process.execPath, [script, ...arguments_], {
    stdio: 'inherit',
    windowsHide: true,
    ...options,
  })

  managedProcesses.add(child)
  child.once('exit', () => managedProcesses.delete(child))
  return child
}

async function waitForServer(server) {
  const deadline = Date.now() + 120_000

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Vite avsluttet før serveren var klar (${server.exitCode}).`)
    }

    try {
      const response = await fetch(baseURL, {
        signal: AbortSignal.timeout(1_000),
      })

      if (response.status < 500) {
        return
      }
    } catch {
      // Serveren er ikke klar ennå.
    }

    await delay(250)
  }

  throw new Error(`Vite svarte ikke på ${baseURL} innen 120 sekunder.`)
}

async function terminateProcessTree(child) {
  if (!child?.pid || child.exitCode !== null) {
    return
  }

  if (process.platform === 'win32') {
    const result = spawnSync(
      'taskkill',
      ['/PID', String(child.pid), '/T', '/F'],
      {
        stdio: 'ignore',
        windowsHide: true,
        timeout: 10_000,
      },
    )

    if (result.error) {
      child.kill()
    }

    return
  }

  try {
    process.kill(-child.pid, 'SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }

  const exited = await Promise.race([
    once(child, 'exit').then(() => true),
    delay(5_000).then(() => false),
  ])

  if (!exited) {
    try {
      process.kill(-child.pid, 'SIGKILL')
    } catch {
      child.kill('SIGKILL')
    }
  }
}

async function stopManagedProcesses() {
  await Promise.all([...managedProcesses].map(terminateProcessTree))
}

async function handleSignal(exitCode) {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  await stopManagedProcesses()
  process.exit(exitCode)
}

process.once('SIGINT', () => void handleSignal(130))
process.once('SIGTERM', () => void handleSignal(143))

async function main() {
  const vite = startNodeProcess(
    viteCli,
    ['--host', host, '--port', String(port), '--strictPort'],
    { detached: process.platform !== 'win32' },
  )

  await waitForServer(vite)

  const playwright = startNodeProcess(playwrightCli, [
    'test',
    '--config',
    'playwright.config.ts',
    ...process.argv.slice(2),
  ])
  const [exitCode, signal] = await once(playwright, 'exit')

  return exitCode ?? (signal ? 1 : 0)
}

main()
  .then(async (exitCode) => {
    await stopManagedProcesses()
    process.exit(exitCode)
  })
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : error)
    await stopManagedProcesses()
    process.exit(1)
  })
