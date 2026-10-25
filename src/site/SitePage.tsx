import type { Lang } from '../lang'
import { Landing } from '../landing/Landing'
import { About } from './About'
import { Docs } from './Docs'
import type { Page } from './pages'

export function SitePage({ lang, page }: { lang: Lang; page: Page }) {
  if (page === 'about') return <About lang={lang} />
  if (page === 'docs') return <Docs lang={lang} />
  return <Landing lang={lang} />
}
