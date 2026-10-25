import { isTauri } from '@tauri-apps/api/core'
import { byPath, type Drawer, isMarkdown, type Leaf, plainName, skipFolder } from './types'

export const onDesktop = () => isTauri()

const join = (...parts: string[]) => parts.filter(Boolean).join('/').replace(/\/{2,}/g, '/')

const lastPart = (path: string) => path.split(/[\\/]/).filter(Boolean).pop() ?? path

// The desktop drawer talks to the real filesystem through Tauri's plugins.
// Paths inside the drawer stay relative so the shelf reads the same on every OS.
export const pickDesktopFolder = async (): Promise<Drawer | null> => {
  const { open } = await import('@tauri-apps/plugin-dialog')
  const picked = await open({ directory: true, multiple: false, title: 'Open a folder' })
  if (!picked || Array.isArray(picked)) return null
  return desktopDrawer(picked)
}

export const desktopDrawer = async (root: string): Promise<Drawer> => {
  const fs = await import('@tauri-apps/plugin-fs')

  const walk = async (relative: string, out: Leaf[]) => {
    for (const entry of await fs.readDir(join(root, relative))) {
      if (entry.isDirectory) {
        if (!skipFolder(entry.name)) await walk(join(relative, entry.name), out)
      } else if (entry.isFile && isMarkdown(entry.name)) {
        out.push({ path: join(relative, entry.name), name: entry.name, dir: relative })
      }
    }
  }

  return {
    kind: 'tauri',
    label: lastPart(root),
    async list() {
      const out: Leaf[] = []
      await walk('', out)
      return out.sort(byPath)
    },
    read: (path) => fs.readTextFile(join(root, path)),
    write: (path, text) => fs.writeTextFile(join(root, path), text),
    async create(name) {
      const fileName = plainName(name)
      const target = join(root, fileName)
      if (!(await fs.exists(target))) await fs.writeTextFile(target, '')
      return { path: fileName, name: fileName, dir: '' }
    },
  }
}

export const saveDesktopFile = async (suggested: string, text: string, label: string, extensions: string[]) => {
  const [{ save }, fs] = await Promise.all([import('@tauri-apps/plugin-dialog'), import('@tauri-apps/plugin-fs')])
  const target = await save({ defaultPath: suggested, filters: [{ name: label, extensions }] })
  if (!target) return false
  await fs.writeTextFile(target, text)
  return true
}
