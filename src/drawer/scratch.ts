import { type Drawer, type Leaf, plainName } from './types'

const key = 'typesirkel:scratch'

const welcome = `# Hello, typeSirkel

A quiet place to write markdown. Open a folder from the shelf on the left, or keep typing here. This page lives in your browser until you do.

## Writing

Headings become stops on the trail in the sidebar. Move your cursor or scroll, and the marker follows you.

### Shortcuts

- **Bold** with Cmd/Ctrl + B
- *Italic* with Cmd/Ctrl + I
- [Links](https://github.com/aconymouse/typesirkel) with Cmd/Ctrl + K
- Save with Cmd/Ctrl + S

## Reading

Switch between write, split, and read at the bottom. Export to HTML or print to PDF when the draft is ready.

### Code

\`\`\`ts
const draft = await drawer.read('notes.md')
\`\`\`

## Folders

Everything stays plain \`.md\` on your disk. No accounts, no sync, no lock-in.
`

// Scratch is a notebook for things that have no folder yet. Notes live in the
// app's own storage, kept as plain markdown text under their file names.
const notesKey = 'typesirkel:scratch-notes'

type Notes = Record<string, string>

const readNotes = (): Notes => {
  try {
    const stored = localStorage.getItem(notesKey)
    if (stored) return JSON.parse(stored) as Notes
    const older = localStorage.getItem(key)
    return { 'scratch.md': older ?? welcome }
  } catch {
    return { 'scratch.md': welcome }
  }
}

let notes: Notes | null = null

const keep = () => {
  try {
    localStorage.setItem(notesKey, JSON.stringify(notes))
    localStorage.removeItem(key)
  } catch {
    // Private windows refuse storage. The notes still live in memory.
  }
}

const book = () => (notes ??= readNotes())

const leafOf = (name: string): Leaf => ({ path: name, name, dir: '' })

export const scratchDrawer = (): Drawer => ({
  kind: 'scratch',
  label: 'Scratch',
  async list() {
    return Object.keys(book())
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map(leafOf)
  },
  async read(path) {
    return book()[path] ?? ''
  },
  async write(path, text) {
    book()[path] = text
    keep()
  },
  async create(name) {
    const all = book()
    const wanted = plainName(name)
    const dot = wanted.lastIndexOf('.')
    let fileName = wanted
    for (let n = 2; fileName in all; n++) fileName = `${wanted.slice(0, dot)}-${n}${wanted.slice(dot)}`
    all[fileName] = ''
    keep()
    return leafOf(fileName)
  },
})
