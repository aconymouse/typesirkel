import { type Lang, langAt, langOf } from '../lang'

// The site is a handful of pages, each in every language: /, /about/, /docs/
// and /support/, with /id/about/ and friends for the rest. The FAQ lives on
// /about/.
export const pages = ['home', 'about', 'docs', 'support'] as const

export type Page = (typeof pages)[number]

export const pathFor = (lang: Lang, page: Page) => `${langOf(lang).path}${page === 'home' ? '' : `${page}/`}`

// Every door into the editor says which page it was on and where it sat, so
// the analytics can tell the header button from the hero link.
export const editorFrom = (lang: Lang, page: Page, spot: string) =>
  `/write/?${new URLSearchParams({ lang, utm_source: 'typesirkel', utm_medium: 'site', utm_campaign: spot, utm_content: page })}`

export const whereAt =(pathname: string): { lang: Lang; page: Page } => {
  const lang = langAt(pathname)
  const rest = pathname.slice(langOf(lang).path.length).replace(/\/+$/, '')
  const page = pages.find((p) => p === rest) ?? 'home'
  return { lang, page }
}
