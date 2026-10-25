import { browserDrawer } from './browser'
import { desktopDrawer } from './tauri'
import type { Drawer, Source } from './types'

// Folders opened before, newest first. Browser folders can only be remembered as
// handles, and handles only fit in IndexedDB, so everything lives there.

export type Recent = { id: string; label: string; at: number; source: Source }

const most = 8
const base = 'typesirkel'
const shelf = 'recent'

type Permitted = FileSystemDirectoryHandle & {
  queryPermission?: (options: { mode: 'readwrite' }) => Promise<PermissionState>
  requestPermission?: (options: { mode: 'readwrite' }) => Promise<PermissionState>
}

const open = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(base, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(shelf, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const run = async <T,>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await open()
  return new Promise<T>((resolve, reject) => {
    const request = work(db.transaction(shelf, mode).objectStore(shelf))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  }).finally(() => db.close())
}

export const recentFolders = async (): Promise<Recent[]> => {
  try {
    const all = await run<Recent[]>('readonly', (store) => store.getAll())
    return all.sort((a, b) => b.at - a.at)
  } catch {
    return []
  }
}

const sameFolder = async (a: Source, b: Source) => {
  if ('path' in a && 'path' in b) return a.path === b.path
  if ('handle' in a && 'handle' in b) return a.handle.isSameEntry(b.handle)
  return false
}

export const rememberFolder = async (drawer: Drawer) => {
  const source = drawer.source
  if (!source) return
  try {
    const all = await recentFolders()
    let id: string = crypto.randomUUID()
    for (const item of all) if (await sameFolder(item.source, source)) id = item.id
    await run('readwrite', (store) => store.put({ id, label: drawer.label, at: Date.now(), source } satisfies Recent))
    const stale = (await recentFolders()).slice(most)
    for (const item of stale) await run('readwrite', (store) => store.delete(item.id))
  } catch {}
}

export const forgetFolder = (id: string) => run('readwrite', (store) => store.delete(id)).catch(() => {})

// Browsers ask again before a remembered folder can be written. The click that
// chose it from the menu is the gesture that permission prompt needs.
export const reopenFolder = async (recent: Recent): Promise<Drawer | null> => {
  const source = recent.source
  if ('path' in source) return desktopDrawer(source.path)
  const handle = source.handle as Permitted
  const state = (await handle.queryPermission?.({ mode: 'readwrite' })) ?? 'prompt'
  if (state !== 'granted' && (await handle.requestPermission?.({ mode: 'readwrite' })) !== 'granted') return null
  return browserDrawer(handle)
}
