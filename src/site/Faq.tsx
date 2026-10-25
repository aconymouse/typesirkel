import { useEffect, useMemo } from 'react'
import type { Lang } from '../lang'
import { contentFor } from './content'
import { plainText, prose } from './prose'

// Each question is a level two heading with a fixed id, `## Is it free? {#free}`;
// everything under it is the answer.
export const faqEntries = (lang: Lang) =>
  contentFor('faq', lang)
    .body.split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [line, ...rest] = chunk.split('\n')
      const id = line.match(/\{#([\w-]+)\}\s*$/)?.[1] ?? ''
      return { id, question: line.replace(/\s*\{#[\w-]+\}\s*$/, '').trim(), answer: rest.join('\n').trim() }
    })

export const faqSchema = (lang: Lang) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: faqEntries(lang).map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(prose(e.answer).html) },
    })),
  })

// A question's link opens it, whether it was clicked here or arrived in an address.
const openFromHash = () => {
  const id = decodeURIComponent(window.location.hash.slice(1))
  const target = id ? document.getElementById(id) : null
  if (!(target instanceof HTMLDetailsElement)) return
  target.open = true
  target.scrollIntoView({ block: 'start' })
}

export function FaqSection({ lang }: { lang: Lang }) {
  const page = contentFor('faq', lang)
  const entries = useMemo(() => faqEntries(lang).map((e) => ({ ...e, html: prose(e.answer).html })), [lang])

  useEffect(() => {
    requestAnimationFrame(openFromHash)
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <p className="kicker">{page.kicker}</p>
      <h2 id="faq-title" className="faq-title">
        {page.title}
      </h2>
      <div className="faq-list">
        {entries.map((e, i) => (
          <details key={e.id || e.question} id={e.id || undefined} open={i === 0}>
            <summary>
              <h3>{e.question}</h3>
              {e.id ? (
                <a className="faq-hash" href={`#${e.id}`} aria-label={`Link to: ${e.question}`} onClick={(event) => event.stopPropagation()}>
                  #
                </a>
              ) : null}
              <svg className="faq-sign" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path className="faq-across" d="M2 7h10" />
                <path className="faq-down" d="M7 2v10" />
              </svg>
            </summary>
            <div className="site-prose" dangerouslySetInnerHTML={{ __html: e.html }} />
          </details>
        ))}
      </div>
    </section>
  )
}
