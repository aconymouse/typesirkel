export type Leaf = {
  path: string
  name: string
  dir: string
}

export type DrawerKind = 'scratch' | 'browser' | 'loose' | 'tauri'

// A drawer is wherever the words live. The desk never cares which one it is.
export interface Drawer {
  kind: DrawerKind
  label: string
  list(): Promise<Leaf[]>
  read(path: string): Promise<string>
  write(path: string, text: string): Promise<void>
  create(name: string): Promise<Leaf>
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
