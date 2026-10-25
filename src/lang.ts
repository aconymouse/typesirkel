import { useEffect, useState } from 'react'
import { recall, remember } from './keep'

// The languages typeSirkel speaks. Each one has its own landing page, so search
// engines can show people the version in their language; the prompt shelf in
// the editor follows the same choice. The editor itself is still in English.
export const langs = [
  { id: 'en', name: 'English', path: '/', short: 'EN' },
  { id: 'id', name: 'Bahasa Indonesia', path: '/id/', short: 'ID' },
  { id: 'pt-BR', name: 'Português (Brasil)', path: '/pt-br/', short: 'PT' },
  { id: 'ko', name: '한국어', path: '/ko/', short: 'KO' },
  { id: 'th', name: 'ไทย', path: '/th/', short: 'TH' },
  { id: 'zh-Hans', name: '简体中文', path: '/zh/', short: '中文' },
] as const

export type Lang = (typeof langs)[number]['id']

const ids = langs.map((l) => l.id) as Lang[]

export const langOf = (id: Lang) => langs.find((l) => l.id === id) ?? langs[0]

// Kept in step with the redirect that scripts/locales.mjs writes into the root
// page. Traditional Chinese readers are left to their next preference rather
// than being handed simplified script they did not ask for.
const match = (wanted: string): Lang | undefined => {
  const lower = wanted.toLowerCase()
  if (lower.startsWith('pt')) return 'pt-BR'
  if (lower.startsWith('zh')) return /hant|-tw|-hk|-mo/.test(lower) ? undefined : 'zh-Hans'
  return ids.find((id) => lower === id.toLowerCase() || lower.startsWith(`${id.toLowerCase()}-`))
}

export const guessLang = (): Lang => {
  for (const wanted of navigator.languages ?? [navigator.language]) {
    const found = match(wanted)
    if (found) return found
  }
  return 'en'
}

const stored = (): Lang | null => {
  const value = recall<Lang | ''>('lang', '', ids)
  return value || null
}

export const currentLang = (): Lang => stored() ?? guessLang()

// Only an explicit pick is remembered. Following a shared /ko/ link should not
// quietly turn someone's prompt shelf Korean.
export const chooseLang = (lang: Lang) => remember('lang', lang)

export const langAt = (pathname: string): Lang => {
  const first = pathname.split('/')[1]?.toLowerCase() ?? ''
  return langs.find((l) => l.path === `/${first}/`)?.id ?? 'en'
}

// Another tab, the landing page for instance, may change the language while
// the editor is open. The storage event carries that over.
export const useLang = () => {
  const [lang, setLang] = useState<Lang>(currentLang)
  useEffect(() => {
    const follow = (event: StorageEvent) => event.key === 'typesirkel:lang' && setLang(currentLang())
    window.addEventListener('storage', follow)
    return () => window.removeEventListener('storage', follow)
  }, [])
  const choose = (next: Lang) => {
    chooseLang(next)
    setLang(next)
  }
  return [lang, choose] as const
}
