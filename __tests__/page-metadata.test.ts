import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const appDir = join(process.cwd(), 'app')

/**
 * The catch-all redirects rather than rendering, so it has no metadata of its
 * own. Every other route is a real indexable page and must describe itself.
 */
const EXEMPT = ['[...slug]']

function findPageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return EXEMPT.includes(entry) ? [] : findPageFiles(full)
    }
    return entry === 'page.tsx' ? [full] : []
  })
}

const pageFiles = findPageFiles(appDir)

describe('page metadata coverage', () => {
  it('finds the route files to check', () => {
    expect(pageFiles.length).toBeGreaterThan(20)
  })

  it.each(pageFiles.map((file) => [relative(appDir, file), file]))(
    '%s declares its own title and description',
    (_label, file) => {
      const source = readFileSync(file, 'utf8')
      const isRoot = relative(appDir, file) === 'page.tsx'

      // The homepage inherits the root layout's metadata, which is canonical for '/'.
      if (isRoot) return

      expect(source).toMatch(/export (const metadata|async function generateMetadata)/)
    },
  )

  it('spells the company name consistently across every route', () => {
    const wrong = pageFiles.filter((file) => readFileSync(file, 'utf8').includes('Everyday Travels'))
    expect(wrong.map((file) => relative(appDir, file))).toEqual([])
  })
})
