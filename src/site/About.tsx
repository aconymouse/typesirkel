import { useMemo, useRef } from 'react'
import type { Lang } from '../lang'
import { copies } from '../landing/copy'
import { SiteFooter, SiteHeader, useHead } from './Chrome'
import { contentFor } from './content'
import { FaqSection } from './Faq'
import { prose } from './prose'
import { useTheater } from './theater'

const profiles = [
  {
    name: 'aconymous.com',
    href: 'https://aconymous.com',
    icon: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20',
    line: true,
  },
  {
    name: 'Threads',
    href: 'https://www.threads.com/@aconymous_',
    icon: 'M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/tjuanmudaco/',
    icon: 'M2.6 8.4h4.2V22H2.6zM4.7 1.8a2.45 2.45 0 1 1 0 4.9 2.45 2.45 0 0 1 0-4.9M9.4 8.4h4v1.86h.06c.56-1.06 1.93-2.18 3.97-2.18 4.25 0 5.03 2.8 5.03 6.43V22h-4.19v-6.6c0-1.58-.03-3.6-2.19-3.6-2.2 0-2.53 1.71-2.53 3.48V22H9.4z',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/aconymouse',
    icon: 'M12 0c6.63 0 12 5.276 12 11.79-.001 5.067-3.29 9.567-8.175 11.187-.6.118-.825-.25-.825-.56 0-.398.015-1.665.015-3.242 0-1.105-.375-1.813-.81-2.181 2.67-.295 5.475-1.297 5.475-5.822 0-1.297-.465-2.344-1.23-3.169.12-.295.54-1.503-.12-3.125 0 0-1.005-.324-3.3 1.209a11.32 11.32 0 00-3-.398c-1.02 0-2.04.133-3 .398-2.295-1.518-3.3-1.209-3.3-1.209-.66 1.622-.24 2.83-.12 3.125-.765.825-1.23 1.887-1.23 3.169 0 4.51 2.79 5.527 5.46 5.822-.345.294-.66.81-.765 1.577-.69.31-2.415.81-3.495-.973-.225-.354-.9-1.223-1.845-1.209-1.005.015-.405.56.015.781.51.28 1.095 1.327 1.23 1.666.24.663 1.02 1.93 4.035 1.385 0 .988.015 1.916.015 2.196 0 .31-.225.664-.825.56C3.303 21.374-.003 16.867 0 11.791 0 5.276 5.37 0 12 0z',
  },
]

// Every paragraph and heading is a line of the lyric sheet; a quote counts
// line by line.
const cast = (root: HTMLElement) => ({
  beats: Array.from(root.children).flatMap((el) => (el.tagName === 'BLOCKQUOTE' ? Array.from(el.children) : [el])) as HTMLElement[],
})

export function About({ lang }: { lang: Lang }) {
  const page = contentFor('about', lang)
  const { html } = useMemo(() => prose(page.body), [page.body])
  const article = useRef<HTMLElement>(null)
  useHead(lang, page.title, page.description)
  useTheater(article, lang, cast)

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
          <figure className="maker-card">
            <img src="/hafidznc-portrait.webp" alt="Hafidz Nc" width={540} height={576} decoding="async" />
            <figcaption>
              <strong>Hafidz Nc</strong>
              <span>{copies[lang].nav.maker}</span>
            </figcaption>
            <nav className="maker-links" aria-label="Hafidz Nc">
              {profiles.map((profile) => (
                <a key={profile.name} href={profile.href} target="_blank" rel={profile.line ? 'author noopener' : 'me noopener'} aria-label={profile.name} title={profile.name}>
                  <svg viewBox="0 0 24 24" width="16" height="16" className={profile.line ? 'is-line' : undefined} aria-hidden="true">
                    <path d={profile.icon} />
                  </svg>
                </a>
              ))}
            </nav>
          </figure>
        </aside>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
