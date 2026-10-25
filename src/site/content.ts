import type { Lang } from '../lang'
import type { Page } from './pages'

// Page words live in content/<page>/<lang>.md, so translating a page means
// adding one file. A page without a translation falls back to English.

export type Content = { title: string; description: string; kicker: string; body: string }

const files = import.meta.glob<string>('../../content/*/*.md', { query: '?raw', import: 'default', eager: true })

const parse = (raw: string): Content => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta: Record<string, string> = {}
  for (const line of (match?.[1] ?? '').split(/\r?\n/)) {
    const at = line.indexOf(':')
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  return { title: meta.title ?? '', description: meta.description ?? '', kicker: meta.kicker ?? '', body: (match?.[2] ?? raw).trim() }
}

const shelf = new Map<string, Content>()
for (const [path, raw] of Object.entries(files)) {
  const [, page, lang] = path.match(/content\/([\w-]+)\/([\w-]+)\.md$/) ?? []
  if (page && lang) shelf.set(`${page}/${lang}`, parse(raw))
}

export const contentFor = (page: Exclude<Page, 'home'>, lang: Lang): Content => shelf.get(`${page}/${lang}`) ?? shelf.get(`${page}/en`) ?? { title: '', description: '', kicker: '', body: '' }
