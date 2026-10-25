import { useEffect, useMemo, useRef, useState } from 'react'
import type { Heading } from '../ink'
import type { Lang } from '../lang'
import { copies } from '../landing/copy'
import { Lookout } from '../Lookout'
import { SiteFooter, SiteHeader, useHead } from './Chrome'
import { contentFor } from './content'
import { prose } from './prose'

export function Docs({ lang }: { lang: Lang }) {
  const page = contentFor('docs', lang)
  const { html, marks } = useMemo(() => prose(page.body), [page.body])
  const trail: Heading[] = useMemo(() => marks.filter((m) => m.level === 2).map((m, line) => ({ id: m.id, level: 1, text: m.text, line })), [marks])
  const [active, setActive] = useState(0)
  const body = useRef<HTMLElement>(null)
  useHead(lang, page.title, page.description)

  // The marker follows whichever section's heading was passed last.
  useEffect(() => {
    const root = body.current
    if (!root) return
    let frame = 0
    const read = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const edge = 140
        const near = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
        let index = 0
        trail.forEach((h, i) => {
          const el = document.getElementById(h.id)
          if (el && el.getBoundingClientRect().top <= edge) index = i
        })
        setActive(near ? trail.length - 1 : index)
      })
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', read)
    }
  }, [trail])

  const pick = (heading: Heading) => {
    const el = document.getElementById(heading.id)
    if (!el) return
    history.replaceState(null, '', `#${heading.id}`)
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 124, behavior: 'smooth' })
  }

  return (
    <div className="landing site">
      <SiteHeader lang={lang} page="docs" />
      <main className="site-main docs">
        <aside className="docs-toc" aria-label={copies[lang].nav.contents}>
          <p className="docs-toc-label">{copies[lang].nav.contents}</p>
          <Lookout headings={trail} active={active} onPick={pick} bare />
        </aside>
        <div className="docs-body">
          <p className="kicker">{page.kicker}</p>
          <h1 className="site-title">{page.title}</h1>
          <article className="site-prose" ref={body} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
