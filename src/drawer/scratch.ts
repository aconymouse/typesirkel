import type { Drawer, Leaf } from './types'

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

const leaf: Leaf = { path: 'scratch.md', name: 'scratch.md', dir: '' }

export const scratchDrawer = (): Drawer => ({
  kind: 'scratch',
  label: 'Scratch',
  async list() {
    return [leaf]
  },
  async read() {
    try {
      return localStorage.getItem(key) ?? welcome
    } catch {
      return welcome
    }
  },
  async write(_path, text) {
    try {
      localStorage.setItem(key, text)
    } catch {
      // Private windows refuse storage. The draft still lives in memory.
    }
  },
  async create() {
    return leaf
  },
})
