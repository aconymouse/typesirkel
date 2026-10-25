import { onDesktop } from '../drawer/tauri'
import type { VoiceId } from './voices'

// Where API keys live. The desktop app hands them to the operating system's
// credential store. The browser has nothing that safe, so by default a key only
// lasts as long as the tab, and is written to local storage only when asked.

const slot = (voice: VoiceId) => `typesirkel:quill-key:${voice}`

const desktop = async () => (await import('@tauri-apps/api/core')).invoke

const quietly = <T,>(fn: () => T, fallback: T): T => {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export const readKey = async (voice: VoiceId): Promise<string> => {
  if (onDesktop()) return ((await (await desktop())<string | null>('read_secret', { name: voice })) ?? '')
  return quietly(() => sessionStorage.getItem(slot(voice)) ?? localStorage.getItem(slot(voice)) ?? '', '')
}

export const keepKey = async (voice: VoiceId, key: string, remember: boolean) => {
  if (onDesktop()) {
    const invoke = await desktop()
    if (key) await invoke('keep_secret', { name: voice, value: key })
    else await invoke('forget_secret', { name: voice })
    return
  }
  quietly(() => {
    localStorage.removeItem(slot(voice))
    sessionStorage.removeItem(slot(voice))
    if (key) (remember ? localStorage : sessionStorage).setItem(slot(voice), key)
  }, undefined)
}

export const remembers = (voice: VoiceId) => onDesktop() || quietly(() => localStorage.getItem(slot(voice)) !== null, false)

// Earlier versions kept keys inside the plain settings object. They move to the
// session on first read and the old copy is dropped.
export const takeOldKeys = (stored: Record<string, unknown>) => {
  const found: Partial<Record<VoiceId, string>> = {}
  const keys = stored.keys as Partial<Record<VoiceId, string>> | undefined
  if (keys) Object.assign(found, keys)
  if (typeof stored.key === 'string' && stored.key && typeof stored.voice === 'string') found[stored.voice as VoiceId] = stored.key
  return found
}
