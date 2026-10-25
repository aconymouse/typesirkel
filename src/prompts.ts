import type { Lang } from './lang'

// The prompt shelf ships with the app. Each prompt is a markdown file in
// prompts/ with a little front matter: `horror.md` is the English original and
// `horror.ko.md` its Korean version. A prompt without a translation falls back
// to English, so adding one is still a single pull request.

export type Prompt = { id: string; title: string; category: string; description: string; body: string; lang: Lang | 'en' }

const files = import.meta.glob<string>('../prompts/*.md', { query: '?raw', import: 'default', eager: true })

const order = ['Fiction', 'News', 'Articles', 'Scripts']

const parse = (raw: string) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta: Record<string, string> = {}
  for (const line of (match?.[1] ?? '').split(/\r?\n/)) {
    const at = line.indexOf(':')
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  return { meta, body: (match?.[2] ?? raw).trim() }
}

const shelf = new Map<string, Map<string, Prompt>>()

for (const [path, raw] of Object.entries(files)) {
  const [id, lang = 'en'] = (path.split('/').pop() ?? path).replace(/\.md$/, '').split('.')
  const { meta, body } = parse(raw)
  const versions = shelf.get(id) ?? new Map<string, Prompt>()
  versions.set(lang, { id, lang: lang as Lang, title: meta.title ?? id, category: meta.category ?? 'Other', description: meta.description ?? '', body })
  shelf.set(id, versions)
}

// Sorting and grouping follow the English original, so the shelf keeps the
// same shape in every language.
const rank = (category: string) => (order.includes(category) ? order.indexOf(category) : order.length)

const originals = [...shelf.values()]
  .map((v) => v.get('en'))
  .filter((p): p is Prompt => !!p)
  .sort((a, b) => rank(a.category) - rank(b.category) || a.title.localeCompare(b.title))

export const promptsIn = (lang: Lang) => originals.map((p) => shelf.get(p.id)?.get(lang) ?? p)

export const byCategory = (lang: Lang) => {
  const groups = new Map<string, { label: string; prompts: Prompt[] }>()
  originals.forEach((original) => {
    const shown = shelf.get(original.id)?.get(lang) ?? original
    const group = groups.get(original.category) ?? { label: shown.category, prompts: [] }
    group.prompts.push(shown)
    groups.set(original.category, group)
  })
  return [...groups.values()]
}
