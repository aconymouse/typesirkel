import { useMemo } from 'react'
import type { Lang } from '../lang'
import { copies } from '../landing/copy'
import { SiteFooter, SiteHeader, useHead } from './Chrome'
import { contentFor } from './content'
import { prose } from './prose'
import { signature } from './signature'

export function About({ lang }: { lang: Lang }) {
  const page = contentFor('about', lang)
  const { html } = useMemo(() => prose(page.body), [page.body])
  useHead(lang, page.title, page.description)

  return (
    <div className="landing site">
      <SiteHeader lang={lang} page="about" />
      <main className="site-main about">
        <p className="kicker">{page.kicker}</p>
        <h1 className="site-title">{page.title}</h1>
        <article className="site-prose about-prose" dangerouslySetInnerHTML={{ __html: html }} />
        <figure className="signed">
          <img src="/hafidznc-portrait.webp" alt="Hafidz Nc" width={540} height={553} loading="lazy" decoding="async" />
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
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
