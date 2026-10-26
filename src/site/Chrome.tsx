import { useEffect, useRef, useState } from 'react'
import { recall, remember } from '../keep'
import { chooseLang, type Lang, langOf, langs } from '../lang'
import { copies } from '../landing/copy'
import { Star } from '../landing/Star'
import { editorFrom, type Page, pathFor } from './pages'

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
  const pick = (next: 'light' | 'dark') => setTheme(next === (systemDark ? 'dark' : 'light') ? 'system' : next)
  const flip = () => pick(shown === 'dark' ? 'light' : 'dark')
  return { shown, flip, pick }
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

const links = (lang: Lang) => {
  const t = copies[lang].nav
  return [
    { page: 'docs' as const, href: pathFor(lang, 'docs'), label: t.docs },
    { page: 'about' as const, href: pathFor(lang, 'about'), label: t.about },
    { page: null, href: `${pathFor(lang, 'about')}#faq`, label: t.faq },
    { page: 'support' as const, href: pathFor(lang, 'support'), label: t.support },
  ]
}

function LangPick({ lang, page }: { lang: Lang; page: Page }) {
  const t = copies[lang].nav
  const switchTo = (next: Lang) => {
    chooseLang(next)
    window.location.assign(pathFor(next, page))
  }
  return (
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
  )
}

const Sun = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="3.2" />
    <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
  </svg>
)

const Moon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z" />
  </svg>
)

export function SiteHeader({ lang, page }: { lang: Lang; page: Page }) {
  const { shown, flip, pick } = useTheme()
  const t = copies[lang].nav
  const menu = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  const toggle = () => {
    const dialog = menu.current
    if (!dialog) return
    if (dialog.open) dialog.close()
    else {
      dialog.showModal()
      setOpen(true)
    }
  }

  const logo = (
    <a href={pathFor(lang, 'home')} className="brand" aria-label="typeSirkel">
      <img src={shown === 'dark' ? '/logo.svg' : '/logo-ink.svg'} alt="typeSirkel" width={101} height={32} />
    </a>
  )

  return (
    <header className="site-head">
      <div className="site-bar">
        <div className="site-bar-in">
          {logo}
          <div className="site-bar-end">
            <button type="button" className="theme-flip" onClick={flip} aria-label={shown === 'dark' ? t.toLight : t.toDark} title={shown === 'dark' ? t.toLight : t.toDark}>
              {shown === 'dark' ? <Sun /> : <Moon />}
            </button>
            <LangPick lang={lang} page={page} />
            <Star label={t.star} />
            <a href={editorFrom(lang, page, 'header_cta')} className="top-cta">
              {t.openEditor}
            </a>
            <button type="button" className={`burger${open ? ' is-open' : ''}`} aria-expanded={open} aria-controls="site-menu" onClick={toggle}>
              <span className="sr-only">{open ? t.close : t.menu}</span>
              <span className="burger-lines" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>
      <dialog id="site-menu" className="site-menu" ref={menu} aria-label={t.menu} onClose={() => setOpen(false)}>
        <div className="site-menu-top">
          {logo}
          <LangPick lang={lang} page={page} />
          <button type="button" className="burger is-open" onClick={toggle}>
            <span className="sr-only">{t.close}</span>
            <span className="burger-lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
        <ol className="site-menu-links">
          {links(lang).map((link, i) => (
            <li key={link.href}>
              <a href={link.href} aria-current={link.page === page ? 'page' : undefined} onClick={() => menu.current?.close()}>
                <small>{String(i + 1).padStart(2, '0')}</small>
                {link.label}
              </a>
            </li>
          ))}
        </ol>
        <div className="site-menu-theme" role="group" aria-label={t.toDark}>
          <button type="button" aria-pressed={shown === 'light'} onClick={() => pick('light')}>
            {t.light}
          </button>
          <button type="button" aria-pressed={shown === 'dark'} onClick={() => pick('dark')}>
            {t.dark}
          </button>
        </div>
        <div className="site-menu-foot">
          <Star label={t.star} />
          <a href={editorFrom(lang, page, 'menu_cta')} className="top-cta">
            {t.openEditor}
          </a>
        </div>
      </dialog>
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
        <a href={`${pathFor(lang, 'about')}#faq`}>{t.faq}</a>
        <a href={pathFor(lang, 'about')}>{t.about}</a>
        <a href={pathFor(lang, 'support')}>{t.support}</a>
        <a href={repo}>GitHub</a>
        <a href={`${repo}/blob/main/LICENSE`}>MIT</a>
      </span>
    </footer>
  )
}
