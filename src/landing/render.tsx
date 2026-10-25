import { renderToString } from 'react-dom/server'
import type { Lang } from '../lang'
import { langs } from '../lang'
import { contentFor } from '../site/content'
import { faqSchema } from '../site/Faq'
import { type Page, pages, pathFor } from '../site/pages'
import { SitePage } from '../site/SitePage'
import { copies } from './copy'

// Used only at build time: every page in every language gets markup and a
// head of its own, so crawlers read the right words without running scripts.
export const render = (lang: Lang, page: Page) => renderToString(<SitePage lang={lang} page={page} />)

export const metaFor = (lang: Lang, page: Page) => (page === 'home' ? copies[lang].meta : contentFor(page, lang))

export const schemaFor = (lang: Lang, page: Page) => (page === 'faq' ? faqSchema(lang) : '')

export { langs, pages, pathFor }
