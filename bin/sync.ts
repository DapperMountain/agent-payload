#!/usr/bin/env bun
/**
 * Sync Payload agent rules + payload-host overlay into the consumer.
 * Optionally runs @dappermountain/agent-practices sync first when available.
 *
 * Usage:
 *   bunx @dappermountain/agent-payload sync [cwd]
 *   bun ./bin/sync.ts [--postgres] [--no-postgres] [--skip-practices] [cwd]
 */

import {
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const RULES = ['security-critical.mdc', 'i18n.mdc'] as const
const OVERLAY_NAME = 'payload-host'
const POSTGRES_REF = 'database-postgres.md'

function packageRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..')
}

function parseArgs(argv: string[]): {
  cwd: string
  forcePostgres: boolean | null
  skipPractices: boolean
} {
  let forcePostgres: boolean | null = null
  let skipPractices = false
  const positional: string[] = []
  for (const arg of argv) {
    if (arg === 'sync') continue
    if (arg === '--postgres') {
      forcePostgres = true
      continue
    }
    if (arg === '--no-postgres') {
      forcePostgres = false
      continue
    }
    if (arg === '--skip-practices') {
      skipPractices = true
      continue
    }
    if (arg.startsWith('-')) {
      console.error(`Unknown flag: ${arg}`)
      process.exit(1)
    }
    positional.push(arg)
  }
  return { cwd: resolve(positional[0] ?? process.cwd()), forcePostgres, skipPractices }
}

function readPkg(cwd: string): Record<string, unknown> | null {
  const pkgPath = join(cwd, 'package.json')
  if (!existsSync(pkgPath)) return null
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

function depMap(pkg: Record<string, unknown> | null): Record<string, string> {
  if (!pkg) return {}
  return {
    ...((pkg.dependencies as Record<string, string>) ?? {}),
    ...((pkg.devDependencies as Record<string, string>) ?? {}),
    ...((pkg.peerDependencies as Record<string, string>) ?? {}),
  }
}

function detectPostgres(cwd: string): boolean {
  const deps = depMap(readPkg(cwd))
  return Boolean(deps['@payloadcms/db-postgres'])
}

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true })
}

function ensureSymlink(linkPath: string, target: string): void {
  ensureDir(dirname(linkPath))
  if (existsSync(linkPath)) {
    try {
      const stat = lstatSync(linkPath)
      if (stat.isSymbolicLink()) {
        unlinkSync(linkPath)
      } else {
        console.warn(`skip symlink ${linkPath}: path exists and is not a symlink`)
        return
      }
    } catch {
      // continue
    }
  }
  symlinkSync(target, linkPath)
  console.log(`symlink ${linkPath} -> ${target}`)
}

function findPracticesSync(cwd: string): string | null {
  const candidates = [
    join(cwd, 'node_modules', '@dappermountain', 'agent-practices', 'bin', 'sync.ts'),
    join(packageRoot(), '..', 'agent-practices', 'bin', 'sync.ts'),
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return null
}

function runPracticesSync(cwd: string): void {
  const script = findPracticesSync(cwd)
  if (!script) {
    console.log('skip practices sync (package not found)')
    return
  }
  console.log(`running agent-practices sync…`)
  const result = spawnSync(process.execPath, [script, cwd], { stdio: 'inherit' })
  if (result.status !== 0) {
    console.error('agent-practices sync failed')
    process.exit(result.status ?? 1)
  }
}

function copyOverlay(srcDir: string, destDir: string, includePostgres: boolean): void {
  ensureDir(dirname(destDir))
  if (existsSync(destDir)) {
    rmSync(destDir, { recursive: true, force: true })
  }
  cpSync(srcDir, destDir, { recursive: true })
  const pgDest = join(destDir, 'references', POSTGRES_REF)
  if (!includePostgres && existsSync(pgDest)) {
    unlinkSync(pgDest)
    console.log(`omitted ${POSTGRES_REF} (no postgres adapter)`)
  } else if (includePostgres) {
    console.log(`included ${POSTGRES_REF}`)
  }
  console.log(`copied overlay → ${destDir}`)
}

function main(): void {
  const { cwd, forcePostgres, skipPractices } = parseArgs(process.argv.slice(2))
  const root = packageRoot()

  if (!skipPractices) {
    runPracticesSync(cwd)
  }

  const rulesSrc = join(root, 'rules')
  const rulesDest = join(cwd, '.agents', 'rules')
  ensureDir(rulesDest)
  for (const name of RULES) {
    const dest = join(rulesDest, name)
    copyFileSync(join(rulesSrc, name), dest)
    console.log(`copied ${dest}`)
  }

  const wantPostgres = forcePostgres ?? detectPostgres(cwd)
  copyOverlay(
    join(root, 'skills', OVERLAY_NAME),
    join(cwd, '.agents', 'skills', OVERLAY_NAME),
    wantPostgres,
  )

  ensureSymlink(join(cwd, '.cursor', 'rules'), '../.agents/rules')
  ensureSymlink(join(cwd, '.cursor', 'skills'), '../.agents/skills')
  ensureDir(join(cwd, '.agents', 'skills'))

  console.log(`agent-payload sync complete → ${join(cwd, '.agents')}`)
}

main()
