import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'

// The same rules the app uses on its shelf, so the model sees the folder the
// way the writer does: markdown only, and none of the folders nobody reads.
const markdown = /\.(md|markdown|mdx|txt)$/i
const skipped = (name: string) => name.startsWith('.') || name === 'node_modules' || name === 'target' || name === 'dist'

export class Folder {
  readonly root: string

  constructor(root: string) {
    this.root = resolve(root)
  }

  // Every path a model hands us is treated as relative to the folder, and
  // anything that would climb out of it is refused.
  locate(path: string) {
    const target = resolve(this.root, path)
    const inside = relative(this.root, target)
    if (!inside || inside.startsWith('..') || isAbsolute(inside)) throw new Error(`"${path}" is outside the folder`)
    if (!markdown.test(target)) throw new Error(`"${path}" is not a markdown file`)
    return target
  }

  async list() {
    const out: string[] = []
    const walk = async (dir: string) => {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (!skipped(entry.name)) await walk(join(dir, entry.name))
        } else if (entry.isFile() && markdown.test(entry.name)) {
          out.push(relative(this.root, join(dir, entry.name)).split(sep).join('/'))
        }
      }
    }
    await walk(this.root)
    return out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  }

  read(path: string) {
    return readFile(this.locate(path), 'utf8')
  }

  async write(path: string, text: string) {
    const target = this.locate(path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, text, 'utf8')
  }

  async exists(path: string) {
    try {
      return (await stat(this.locate(path))).isFile()
    } catch {
      return false
    }
  }
}

export type Heading = { level: number; text: string; line: number }

// Headings outside fenced code only, the same ones the lookout shows.
export const outline = (text: string): Heading[] => {
  const found: Heading[] = []
  let fenced = false
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    const match = !fenced && line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (match) found.push({ level: match[1].length, text: match[2], line: i + 1 })
  })
  return found
}
