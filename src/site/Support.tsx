import { useMemo } from 'react'
import type { Lang } from '../lang'
import { copies } from '../landing/copy'
import { SiteFooter, SiteHeader, useHead } from './Chrome'
import { contentFor } from './content'
import { marks } from './marks'
import { prose } from './prose'

// Both doors lead off the site: the payment happens on Saweria or PayPal, and
// nothing about it passes through here.
const doors = [
  { name: 'Saweria', href: 'https://saweria.co/aconymous', note: 'saweria' },
  { name: 'PayPal', href: 'https://www.paypal.com/paypalme/sarangseo', note: 'paypal' },
] as const

export function Support({ lang }: { lang: Lang }) {
  const page = contentFor('support', lang)
  const { html } = useMemo(() => prose(page.body), [page.body])
  const give = copies[lang].give
  useHead(lang, page.title, page.description)

  return (
    <div className="landing site">
      <SiteHeader lang={lang} page="support" />
      <main className="site-main support">
        <h1 className="site-title">{page.title}</h1>
        <article className="site-prose" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="support-doors">
          {doors.map((door) => (
            <a key={door.name} className={`support-door is-${door.note}`} href={door.href} target="_blank" rel="noopener">
              <svg className="support-mark" viewBox={marks[door.note].viewBox} aria-hidden="true">
                <path fillRule="evenodd" d={marks[door.note].path} />
              </svg>
              <strong>{door.name}</strong>
              <span>{give[door.note]}</span>
              <svg className="support-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M5 11 11 5M6 5h5v5" />
              </svg>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
