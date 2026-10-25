import { useEffect, useState } from 'react'
import { recall, remember } from '../keep'
import { chooseLang, type Lang, langOf, langs } from '../lang'
import { copies } from '../landing/copy'
import { Star } from '../landing/Star'
import { type Page, pathFor } from './pages'

export const repo = 'https://github.com/aconymouse/typesirkel'

type Theme = 'system' | 'light' | 'dark'

const dark = () => window.matchMedia('(prefers-color-scheme: dark)')
const inBrowser = typeof window !== 'undefined'

// The same theme key as the editor, so a choice made here carries over to /write.
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => recall('theme', 'system', ['system', 'light', 'dark'] as const))
  const [systemDark, setSystemDark] = useState(() => inBrowser && dark().matches)

  useEffect(() => {
    const query = dark()
    const follow = () => setSystemDark(query.matches)
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  }, [])

  useEffect(() => {
    remember('theme', theme)
    if (theme === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])

  const shown = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
  const flip = () => {
    const next = shown === 'dark' ? 'light' : 'dark'
    setTheme(next === (systemDark ? 'dark' : 'light') ? 'system' : next)
  }
  return { shown, flip }
}

// Every page keeps its title and description in step with its language, for
// the moment between the prerendered head and the app taking over.
export const useHead = (lang: Lang, title: string, description: string) => {
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [lang, title, description])
}

export function SiteHeader({ lang, page }: { lang: Lang; page: Page }) {
  const { shown, flip } = useTheme()
  const t = copies[lang].nav

  const switchTo = (next: Lang) => {
    chooseLang(next)
    window.location.assign(pathFor(next, page))
  }

  return (
    <header className="top">
      <a href={pathFor(lang, 'home')} className="brand" aria-label="typeSirkel home">
        <img src={shown === 'dark' ? '/logo.svg' : '/logo-ink.svg'} alt="typeSirkel" width={101} height={32} />
      </a>
      <nav>
        <label className="lang" data-short={langOf(lang).short}>
          <span className="sr-only">{t.language}</span>
          <select value={lang} onChange={(e) => switchTo(e.target.value as Lang)}>
            {langs.map((l) => (
              <option key={l.id} value={l.id} lang={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2.5 4l2.5 2.5L7.5 4" />
          </svg>
        </label>
        <button type="button" className="theme-flip" onClick={flip} aria-label={shown === 'dark' ? t.toLight : t.toDark} title={shown === 'dark' ? t.toLight : t.toDark}>
          {shown === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="3.2" />
              <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z" />
            </svg>
          )}
        </button>
        <Star label={t.star} />
        <a href={`/write/?lang=${lang}`} className="top-cta">
          {t.openEditor}
        </a>
      </nav>
    </header>
  )
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = copies[lang].nav
  return (
    <footer className="foot">
      <span>
        © 2026{' '}
        <a href="https://aconymous.com" title="Hafidz Nc" rel="author">
          Hafidz Nc
        </a>
      </span>
      <span className="foot-links">
        <a href={pathFor(lang, 'docs')}>{t.docs}</a>
        <a href={pathFor(lang, 'faq')}>{t.faq}</a>
        <a href={pathFor(lang, 'about')}>{t.about}</a>
        <a href={repo}>GitHub</a>
        <a href={`${repo}/blob/main/LICENSE`}>MIT</a>
      </span>
    </footer>
  )
}
