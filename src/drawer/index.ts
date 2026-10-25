import { canPickFolder, download, pickBrowserFolder, pickLooseFile } from './browser'
import { scratchDrawer } from './scratch'
import { onDesktop, pickDesktopFolder, saveDesktopFile } from './tauri'
import type { Drawer } from './types'

export type { Drawer, Leaf } from './types'
export { scratchDrawer }

export const folderSupport = () => (onDesktop() ? 'folder' : canPickFolder() ? 'folder' : 'file')

export const openDrawer = (): Promise<Drawer | null> => {
  if (onDesktop()) return pickDesktopFolder()
  if (canPickFolder()) return pickBrowserFolder()
  return pickLooseFile()
}

// Used for exports and for the loose drawer, which has nowhere else to put things.
export const hand = async (name: string, text: string, type: string, label: string, extensions: string[]) => {
  if (onDesktop()) return saveDesktopFile(name, text, label, extensions)
  download(name, text, type)
  return true
}
