import hljs from 'highlight.js/lib/common'
import MarkdownIt from 'markdown-it'

// Markdown for the site's own pages. The words are ours, so unlike the
// editor's preview nothing here needs sanitizing, and it renders the same at
// build time as in the browser.

export type Mark = { id: string; level: number; text: string }

const vouched = ['aconymous.com', 'sirkel.asia']

const followed = (href: string) => {
  try {
    const host = new URL(href).hostname
    return vouched.some((site) => host === site || host.endsWith(`.${site}`))
  } catch {
    return false
  }
}

const md = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
  highlight(code, lang) {
    if (!lang || !hljs.getLanguage(lang)) return ''
    return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`
  },
})

const linkOpen = md.renderer.rules.link_open ?? ((tokens, i, options, _env, self) => self.renderToken(tokens, i, options))
md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  const href = String(tokens[i].attrGet('href') ?? '')
  if (/^https?:/i.test(href)) {
    tokens[i].attrSet('target', '_blank')
    tokens[i].attrSet('rel', followed(href) ? 'noopener' : 'nofollow noopener')
  }
  return linkOpen(tokens, i, options, env, self)
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section'

// Headings may carry a fixed id, `## Quill {#quill}`, so links to a section
// keep working in every translation.
export const prose = (source: string) => {
  const tokens = md.parse(source, {})
  const marks: Mark[] = []
  tokens.forEach((token, i) => {
    if (token.type !== 'heading_open') return
    const inline = tokens[i + 1]
    const fixed = inline.content.match(/\s*\{#([\w-]+)\}\s*$/)
    if (fixed) {
      inline.content = inline.content.slice(0, fixed.index)
      const last = inline.children?.at(-1)
      if (last?.type === 'text') last.content = last.content.replace(/\s*\{#[\w-]+\}\s*$/, '')
    }
    const id = fixed?.[1] ?? slug(inline.content)
    token.attrSet('id', id)
    marks.push({ id, level: Number(token.tag.slice(1)), text: inline.content })
  })
  return { html: md.renderer.render(tokens, md.options, {}), marks }
}

export const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
