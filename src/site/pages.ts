import { type Lang, langAt, langOf } from '../lang'

// The site is a handful of pages, each in every language: /, /about/, /docs/
// and /support/, with /id/about/ and friends for the rest. The FAQ lives on
// /about/.
export const pages = ['home', 'about', 'docs', 'support'] as const

export type Page = (typeof pages)[number]

export const pathFor = (lang: Lang, page: Page) => `${langOf(lang).path}${page === 'home' ? '' : `${page}/`}`

export const whereAt = (pathname: string): { lang: Lang; page: Page } => {
  const lang = langAt(pathname)
  const rest = pathname.slice(langOf(lang).path.length).replace(/\/+$/, '')
  const page = pages.find((p) => p === rest) ?? 'home'
  return { lang, page }
}
