import { useMemo } from 'react'
import type { Lang } from '../lang'
import { SiteFooter, SiteHeader, useHead } from './Chrome'
import { contentFor } from './content'
import { plainText, prose } from './prose'

// Each question is a level two heading; everything under it is the answer.
export const faqEntries = (lang: Lang) => {
  const { body } = contentFor('faq', lang)
  return body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [question, ...rest] = chunk.split('\n')
      return { question: question.trim(), answer: rest.join('\n').trim() }
    })
}

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

export function Faq({ lang }: { lang: Lang }) {
  const page = contentFor('faq', lang)
  const entries = useMemo(() => faqEntries(lang).map((e) => ({ ...e, html: prose(e.answer).html })), [lang])
  useHead(lang, page.title, page.description)

  return (
    <div className="landing site">
      <SiteHeader lang={lang} page="faq" />
      <main className="site-main faq">
        <p className="kicker">{page.kicker}</p>
        <h1 className="site-title">{page.title}</h1>
        <div className="faq-list">
          {entries.map((e, i) => (
            <details key={e.question} open={i === 0}>
              <summary>
                <h2>{e.question}</h2>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M7 2v10M2 7h10" />
                </svg>
              </summary>
              <div className="site-prose" dangerouslySetInnerHTML={{ __html: e.html }} />
            </details>
          ))}
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
