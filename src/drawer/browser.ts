import { byPath, type Drawer, isMarkdown, type Leaf, plainName, skipFolder } from './types'

type Handle = FileSystemDirectoryHandle & {
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>
}

declare global {
  interface Window {
    showDirectoryPicker?: (options?: { mode?: 'read' | 'readwrite'; id?: string }) => Promise<FileSystemDirectoryHandle>
  }
}

export const canPickFolder = () => typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function'

// Chromium lets us hold a real folder. Everyone else gets the loose drawer below.
export const pickBrowserFolder = async (): Promise<Drawer | null> => {
  if (!window.showDirectoryPicker) return null
  let root: FileSystemDirectoryHandle
  try {
    root = await window.showDirectoryPicker({ mode: 'readwrite', id: 'typesirkel' })
  } catch {
    return null
  }
  const files = new Map<string, FileSystemFileHandle>()

  const walk = async (dir: Handle, prefix: string, out: Leaf[]) => {
    for await (const [name, entry] of dir.entries()) {
      if (entry.kind === 'directory') {
        if (!skipFolder(name)) await walk(entry as Handle, `${prefix}${name}/`, out)
      } else if (isMarkdown(name)) {
        const path = `${prefix}${name}`
        files.set(path, entry as FileSystemFileHandle)
        out.push({ path, name, dir: prefix.replace(/\/$/, '') })
      }
    }
  }

  const fileFor = (path: string) => {
    const handle = files.get(path)
    if (!handle) throw new Error(`Lost track of ${path}`)
    return handle
  }

  return {
    kind: 'browser',
    label: root.name,
    async list() {
      files.clear()
      const out: Leaf[] = []
      await walk(root as Handle, '', out)
      return out.sort(byPath)
    },
    async read(path) {
      return (await fileFor(path).getFile()).text()
    },
    async write(path, text) {
      const stream = await fileFor(path).createWritable()
      await stream.write(text)
      await stream.close()
    },
    async create(name) {
      const fileName = plainName(name)
      const handle = await root.getFileHandle(fileName, { create: true })
      files.set(fileName, handle)
      return { path: fileName, name: fileName, dir: '' }
    },
  }
}

// One file in, one file out. Saving hands the browser a download.
export const pickLooseFile = (): Promise<Drawer | null> =>
  new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.mdx,.txt,text/markdown,text/plain'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      let text = await file.text()
      const leaf: Leaf = { path: file.name, name: file.name, dir: '' }
      resolve({
        kind: 'loose',
        label: file.name,
        async list() {
          return [leaf]
        },
        async read() {
          return text
        },
        async write(_path, next) {
          text = next
        },
        async create() {
          return leaf
        },
      })
    }
    input.oncancel = () => resolve(null)
    input.click()
  })

export const download = (name: string, text: string, type = 'text/markdown') => {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
