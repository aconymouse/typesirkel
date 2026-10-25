export type Leaf = {
  path: string
  name: string
  dir: string
}

export type DrawerKind = 'scratch' | 'browser' | 'loose' | 'tauri' | 'circle'

// Enough to find a folder again next time: a path on the desktop, a handle in the browser.
export type Source = { path: string } | { handle: FileSystemDirectoryHandle }

// A drawer is wherever the words live. The desk never cares which one it is.
export interface Drawer {
  kind: DrawerKind
  label: string
  source?: Source
  list(): Promise<Leaf[]>
  read(path: string): Promise<string>
  write(path: string, text: string): Promise<void>
  create(name: string): Promise<Leaf>
  // Only drawers that can see the disk change underneath them offer this.
  watch?(fn: (paths: string[]) => void): Promise<() => void>
}

export const isMarkdown = (name: string) => /\.(md|markdown|mdx|txt)$/i.test(name)

export const plainName = (name: string) => {
  const trimmed = name.trim().replace(/[\\/:*?"<>|]+/g, '-')
  if (!trimmed) return 'untitled.md'
  return isMarkdown(trimmed) ? trimmed : `${trimmed}.md`
}

export const byPath = (a: Leaf, b: Leaf) => a.path.localeCompare(b.path, undefined, { numeric: true, sensitivity: 'base' })

// Folders people never want to see in a writing app.
export const skipFolder = (name: string) => name.startsWith('.') || name === 'node_modules' || name === 'target' || name === 'dist'
