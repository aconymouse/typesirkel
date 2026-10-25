import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Runs after `vite build`: turns the one landing page into a page per language,
// each with its own markup, head and hreflang links, plus a sitemap that ties
// them together. GitHub Pages then serves /ko/ from dist/ko/index.html.

const site = 'https://sirkel.asia'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const server = fileURLToPath(new URL('../dist-ssr/', import.meta.url))

const { render, copies, langs } = await import(pathToFileURL(`${server}render.js`).href)

const locales = { en: 'en_US', id: 'id_ID', 'pt-BR': 'pt_BR', ko: 'ko_KR', th: 'th_TH', 'zh-Hans': 'zh_CN' }

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const alternates = [
  ...langs.map((l) => `<link rel="alternate" hreflang="${l.id}" href="${site}${l.path}" />`),
  `<link rel="alternate" hreflang="x-default" href="${site}/" />`,
].join('\n    ')

// The root page is the English and x-default version. A first-time visitor whose
// browser prefers another language, or anyone who picked one before, is sent on
// before anything paints. Mirrors `match` in src/lang.ts.
const paths = Object.fromEntries(langs.map((l) => [l.id, l.path]))
const redirect = `<script>
      try {
        const paths = ${JSON.stringify(paths)}
        const saved = localStorage.getItem('typesirkel:lang')
        let lang = saved && paths[saved] ? saved : null
        for (const wanted of lang ? [] : (navigator.languages ?? [navigator.language])) {
          const lower = wanted.toLowerCase()
          if (lower.startsWith('pt')) lang = 'pt-BR'
          else if (lower.startsWith('zh')) lang = /hant|-tw|-hk|-mo/.test(lower) ? null : 'zh-Hans'
          else lang = Object.keys(paths).find((id) => lower === id.toLowerCase() || lower.startsWith(id.toLowerCase() + '-')) ?? null
          if (lang) break
        }
        if (lang && lang !== 'en') location.replace(paths[lang] + location.search + location.hash)
      } catch {}
    </script>`

const template = await readFile(`${dist}index.html`, 'utf8')

const swap = (html, pattern, value) => {
  if (!pattern.test(html)) throw new Error(`locales: ${pattern} not found in index.html`)
  return html.replace(pattern, value)
}

for (const lang of langs) {
  const copy = copies[lang.id]
  const url = `${site}${lang.path}`
  let html = template
  html = swap(html, /<html lang="[^"]*">/, `<html lang="${lang.id}">`)
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${escape(copy.meta.title)}</title>`)
  html = swap(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(copy.meta.description)}" />`)
  html = swap(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />\n    ${alternates}`)
  html = swap(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />\n    <meta property="og:locale" content="${locales[lang.id]}" />`)
  html = swap(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escape(copy.meta.description)}" />`)
  if (lang.id === 'en') html = swap(html, /<meta charset="UTF-8" \/>/, `<meta charset="UTF-8" />\n    ${redirect}`)
  html = swap(html, /<div id="root"><\/div>/, `<div id="root">${render(lang.id)}</div>`)
  await mkdir(`${dist}${lang.path.slice(1)}`, { recursive: true })
  await writeFile(`${dist}${lang.path.slice(1)}index.html`, html)
}

const links = langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.id}" href="${site}${l.path}"/>`).join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${langs
  .map(
    (l) => `  <url>
    <loc>${site}${l.path}</loc>
${links}
    <xhtml:link rel="alternate" hreflang="x-default" href="${site}/"/>
  </url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(`${dist}sitemap.xml`, sitemap)
await writeFile(`${dist}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
await rm(server, { recursive: true, force: true })

console.log(`locales: ${langs.map((l) => l.path).join(' ')}`)
