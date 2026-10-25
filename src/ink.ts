import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/common'
import MarkdownIt, { type Token } from 'markdown-it'

export type Heading = {
  id: string
  level: number
  text: string
  line: number
}

export type Inked = {
  html: string
  headings: Heading[]
}

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch {}
    }
    return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`
  },
})

// Links to the web open in a new tab, and stay plain followed links.
const linkOpen = md.renderer.rules.link_open ?? ((tokens, i, options, _env, self) => self.renderToken(tokens, i, options))
md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  if (/^https?:/i.test(String(tokens[i].attrGet('href') ?? ''))) {
    tokens[i].attrSet('target', '_blank')
    tokens[i].attrSet('rel', 'noopener')
  }
  return linkOpen(tokens, i, options, env, self)
}

// Every block remembers which source line it came from. That is how the
// proof, the sheet and the lookout agree on where the reader is.
const blocks = new Set(['paragraph_open', 'heading_open', 'blockquote_open', 'bullet_list_open', 'ordered_list_open', 'table_open', 'hr', 'fence', 'code_block', 'html_block'])

const slug = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section'

const plain = (token: Token | undefined) => (token?.children ?? []).filter((t) => t.type === 'text' || t.type === 'code_inline').map((t) => t.content).join('').trim()

export const ink = (source: string): Inked => {
  const tokens = md.parse(source, {})
  const headings: Heading[] = []
  const taken = new Map<string, number>()

  tokens.forEach((token, i) => {
    if (token.map && blocks.has(token.type)) token.attrSet('data-line', String(token.map[0]))
    if (token.type !== 'heading_open' || !token.map) return
    const text = plain(tokens[i + 1])
    const base = slug(text)
    const seen = taken.get(base) ?? 0
    taken.set(base, seen + 1)
    const id = seen ? `${base}-${seen}` : base
    token.attrSet('id', id)
    headings.push({ id, level: Number(token.tag.slice(1)), text: text || 'Untitled', line: token.map[0] })
  })

  const html = DOMPurify.sanitize(md.renderer.render(tokens, md.options, {}), { ADD_ATTR: ['data-line', 'target'] })
  return { html, headings }
}

export const counts = (source: string) => {
  const words = source.replace(/```[\s\S]*?```/g, ' ').match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0
  return { words, minutes: Math.max(1, Math.round(words / 230)), characters: source.length }
}

export const titleOf = (source: string, fallback: string) => source.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback.replace(/\.[^.]+$/, '')
