// The prompt shelf ships with the app. Each prompt is a markdown file in
// prompts/ with a little front matter, so adding one is a pull request away.

export type Prompt = { id: string; title: string; category: string; description: string; body: string }

const files = import.meta.glob<string>('../prompts/*.md', { query: '?raw', import: 'default', eager: true })

const order = ['Fiction', 'News', 'Articles', 'Scripts']

const parse = (path: string, raw: string): Prompt => {
  const id = path.split('/').pop()?.replace(/\.md$/, '') ?? path
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta: Record<string, string> = {}
  for (const line of (match?.[1] ?? '').split(/\r?\n/)) {
    const at = line.indexOf(':')
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  return { id, title: meta.title ?? id, category: meta.category ?? 'Other', description: meta.description ?? '', body: (match?.[2] ?? raw).trim() }
}

export const prompts: Prompt[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => {
    const rank = (c: string) => (order.includes(c) ? order.indexOf(c) : order.length)
    return rank(a.category) - rank(b.category) || a.title.localeCompare(b.title)
  })

export const byCategory = () => {
  const groups = new Map<string, Prompt[]>()
  for (const p of prompts) groups.set(p.category, [...(groups.get(p.category) ?? []), p])
  return [...groups.entries()]
}
