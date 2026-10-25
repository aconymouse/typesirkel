import { type RefObject, useEffect, useMemo, useRef } from 'react'
import type { Lang } from '../lang'
import { copies } from '../landing/copy'
import { SiteFooter, SiteHeader, useHead } from './Chrome'
import { contentFor } from './content'
import { FaqSection } from './Faq'
import { prose } from './prose'
import { signature } from './signature'

// The words are all in the page from the start, for readers without scripts
// and for search engines. With scripts, they come on like lyrics on a screen:
// each line writes itself out as it reaches the reading line, the one you are
// on stays bright, and the ones you have passed settle back.
const useTheater = (article: RefObject<HTMLElement | null>, lang: Lang) => {
  useEffect(() => {
    const root = article.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const beats = Array.from(root.children).flatMap((el) => (el.tagName === 'BLOCKQUOTE' ? Array.from(el.children) : [el])) as HTMLElement[]
    const words = new Intl.Segmenter(lang, { granularity: 'word' })

    for (const beat of root.classList.contains('theater') ? [] : beats) {
      beat.classList.add('beat')
      const walker = document.createTreeWalker(beat, NodeFilter.SHOW_TEXT)
      const texts: Text[] = []
      while (walker.nextNode()) texts.push(walker.currentNode as Text)
      let count = 0
      for (const text of texts) {
        const pieces = document.createDocumentFragment()
        for (const { segment } of words.segment(text.data)) {
          const span = document.createElement('span')
          span.className = 'w'
          span.style.setProperty('--i', String(Math.min(count++, 70)))
          span.textContent = segment
          pieces.append(span)
        }
        text.replaceWith(pieces)
      }
    }
    root.classList.add('theater')

    let frame = 0
    const follow = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.66
        const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        let now = 0
        beats.forEach((beat, i) => {
          if (beat.getBoundingClientRect().top < line) now = i
        })
        if (bottom) now = beats.length - 1
        beats.forEach((beat, i) => {
          if (i <= now) beat.classList.add('is-shown')
          beat.classList.toggle('is-now', i === now)
        })
      })
    }
    const opening = window.setTimeout(follow, 250)
    window.addEventListener('scroll', follow, { passive: true })
    window.addEventListener('resize', follow)
    return () => {
      window.clearTimeout(opening)
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', follow)
      window.removeEventListener('resize', follow)
    }
  }, [article, lang])
}

export function About({ lang }: { lang: Lang }) {
  const page = contentFor('about', lang)
  const { html } = useMemo(() => prose(page.body), [page.body])
  const article = useRef<HTMLElement>(null)
  useHead(lang, page.title, page.description)
  useTheater(article, lang)

  return (
    <div className="landing site">
      <SiteHeader lang={lang} page="about" />
      <main className="site-main about" id="top">
        <div className="about-words">
          <p className="kicker">{page.kicker}</p>
          <h1 className="site-title">{page.title}</h1>
          <article className="site-prose about-prose" ref={article} dangerouslySetInnerHTML={{ __html: html }} />
          <hr className="about-rule" />
          <FaqSection lang={lang} />
        </div>
        <aside className="about-maker">
          <figure className="signed">
            <img src="/hafidznc-portrait.webp" alt="Hafidz Nc" width={540} height={576} decoding="async" />
            <figcaption>
              <svg className="signature" viewBox={signature.viewBox} role="img" aria-label="Hafidz Nc">
                <path d={signature.path} />
              </svg>
              <span>
                <a href="https://aconymous.com" target="_blank" rel="author noopener">
                  Hafidz Nc
                </a>
                , {copies[lang].nav.maker}
              </span>
            </figcaption>
          </figure>
        </aside>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
