import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Runs after `vite build`: turns the one site entry into a page per language
// and per page (home, about, faq, docs), each with its own markup, head and
// hreflang links, plus a sitemap that ties them together. GitHub Pages then
// serves /ko/docs/ from dist/ko/docs/index.html.

const site = 'https://sirkel.asia'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const server = fileURLToPath(new URL('../dist-ssr/', import.meta.url))

const { render, metaFor, schemaFor, langs, pages, pathFor } = await import(pathToFileURL(`${server}render.js`).href)

const locales = { en: 'en_US', id: 'id_ID', 'pt-BR': 'pt_BR', ko: 'ko_KR', th: 'th_TH', 'zh-Hans': 'zh_CN' }

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const alternatesFor = (page) =>
  [...langs.map((l) => `<link rel="alternate" hreflang="${l.id}" href="${site}${pathFor(l.id, page)}" />`), `<link rel="alternate" hreflang="x-default" href="${site}${pathFor('en', page)}" />`].join('\n    ')

// English pages are also the x-default. A first-time visitor whose browser
// prefers another language, or anyone who picked one before, is sent to the
// same page in that language before anything paints. Mirrors `match` in
// src/lang.ts.
const redirectFor = (page) => {
  const paths = Object.fromEntries(langs.map((l) => [l.id, pathFor(l.id, page)]))
  return `<script>
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
}

const template = await readFile(`${dist}index.html`, 'utf8')

const swap = (html, pattern, value) => {
  if (!pattern.test(html)) throw new Error(`locales: ${pattern} not found in index.html`)
  return html.replace(pattern, value)
}

const written = []

for (const page of pages) {
  for (const lang of langs) {
    const meta = metaFor(lang.id, page)
    const path = pathFor(lang.id, page)
    const url = `${site}${path}`
    const schema = schemaFor(lang.id, page)
    let html = template
    html = swap(html, /<html lang="[^"]*">/, `<html lang="${lang.id}">`)
    html = swap(html, /<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    html = swap(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(meta.description)}" />`)
    html = swap(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />\n    ${alternatesFor(page)}`)
    html = swap(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />\n    <meta property="og:locale" content="${locales[lang.id]}" />`)
    html = swap(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escape(page === 'home' ? 'typeSirkel' : meta.title)}" />`)
    html = swap(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
    if (lang.id === 'en') html = swap(html, /<meta charset="UTF-8" \/>/, `<meta charset="UTF-8" />\n    ${redirectFor(page)}`)
    if (schema) html = swap(html, /<\/head>/, `  <script type="application/ld+json">${schema.replace(/</g, '\\u003c')}</script>\n  </head>`)
    html = swap(html, /<div id="root"><\/div>/, `<div id="root">${render(lang.id, page)}</div>`)
    await mkdir(`${dist}${path.slice(1)}`, { recursive: true })
    await writeFile(`${dist}${path.slice(1)}index.html`, html)
    written.push(path)
  }
}

// The FAQ moved onto the about page. Old links still land on the right spot.
for (const lang of langs) {
  const from = pathFor(lang.id, 'faq')
  const to = `${pathFor(lang.id, 'about')}#faq`
  await mkdir(`${dist}${from.slice(1)}`, { recursive: true })
  await writeFile(
    `${dist}${from.slice(1)}index.html`,
    `<!doctype html><html lang="${lang.id}"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><link rel="canonical" href="${site}${pathFor(lang.id, 'about')}"><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(to)})</script><title>typeSirkel</title></head><body><a href="${to}">${to}</a></body></html>\n`,
  )
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .flatMap((page) =>
    langs.map(
      (l) => `  <url>
    <loc>${site}${pathFor(l.id, page)}</loc>
${langs.map((o) => `    <xhtml:link rel="alternate" hreflang="${o.id}" href="${site}${pathFor(o.id, page)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${pathFor('en', page)}"/>
  </url>`,
    ),
  )
  .join('\n')}
</urlset>
`
await writeFile(`${dist}sitemap.xml`, sitemap)
await writeFile(`${dist}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
await rm(server, { recursive: true, force: true })

console.log(`locales: ${written.length} pages`)
