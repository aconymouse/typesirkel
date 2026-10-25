import { useEffect, useState } from 'react'
import { recall, remember } from './keep'

// The languages typeSirkel speaks. The landing page and the prompt shelf follow
// this choice; the app itself is still in English.
export const langs = [
  { id: 'en', name: 'English' },
  { id: 'id', name: 'Bahasa Indonesia' },
  { id: 'pt-BR', name: 'Português (Brasil)' },
  { id: 'ko', name: '한국어' },
  { id: 'th', name: 'ไทย' },
] as const

export type Lang = (typeof langs)[number]['id']

const ids = langs.map((l) => l.id) as Lang[]

// First visit: the closest match among the browser's preferred languages.
const guess = (): Lang => {
  for (const wanted of navigator.languages ?? [navigator.language]) {
    const lower = wanted.toLowerCase()
    if (lower.startsWith('pt')) return 'pt-BR'
    const found = ids.find((id) => lower === id.toLowerCase() || lower.startsWith(`${id.toLowerCase()}-`))
    if (found) return found
  }
  return 'en'
}

export const currentLang = (): Lang => recall<Lang>('lang', guess(), ids)

export const chooseLang = (lang: Lang) => {
  remember('lang', lang)
  document.documentElement.lang = lang
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
