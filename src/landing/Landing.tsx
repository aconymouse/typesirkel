import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { Heading } from '../ink'
import { recall, remember } from '../keep'
import { chooseLang, type Lang, langOf, langs } from '../lang'
import { Lookout } from '../Lookout'
import { Agents } from './Agents'
import { copies } from './copy'
import { Star } from './Star'

// The real editor, loaded after the page has painted so the hero never waits on CodeMirror.
const LiveDemo = lazy(() => import('./LiveDemo'))

const repo = 'https://github.com/aconymouse/typesirkel'
const releases = `${repo}/releases/latest`

// Where each stop sits in a pretend document, just enough for the marker to walk.
const trail = [
  { level: 1, line: 0 },
  { level: 2, line: 4 },
  { level: 3, line: 9 },
  { level: 3, line: 15 },
  { level: 2, line: 22 },
  { level: 3, line: 28 },
  { level: 2, line: 35 },
]

type System = 'mac' | 'windows' | 'other'
type Theme = 'system' | 'light' | 'dark'

const guessSystem = (): System => {
  const agent = navigator.userAgent
  if (/Mac|iPhone|iPad/.test(agent)) return 'mac'
  if (/Windows/.test(agent)) return 'windows'
  return 'other'
}

const dark = () => window.matchMedia('(prefers-color-scheme: dark)')
const inBrowser = typeof window !== 'undefined'

// The same theme key as the editor, so a choice made here carries over to /write.
const useTheme = () => {
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

export function Landing({ lang }: { lang: Lang }) {
  const [system, setSystem] = useState<System>('other')
  const [stop, setStop] = useState(0)
  const [held, setHeld] = useState(false)
  const { shown, flip } = useTheme()
  const t = copies[lang]

  const trip: Heading[] = useMemo(() => trail.map((s, i) => ({ id: `stop-${i}`, text: t.lookout.stops[i], ...s })), [t])

  useEffect(() => setSystem(guessSystem()), [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, t])

  // The demo walks on its own until someone takes over.
  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const walk = window.setInterval(() => setStop((s) => (s + 1) % trail.length), 1800)
    return () => window.clearInterval(walk)
  }, [held])

  const switchTo = (next: Lang) => {
    chooseLang(next)
    window.location.assign(langOf(next).path)
  }

  const pick = (heading: Heading) => {
    setHeld(true)
    setStop(trip.findIndex((h) => h.id === heading.id))
  }

  return (
    <div className="landing">
      <header className="top">
        <a href={langOf(lang).path} className="brand" aria-label="typeSirkel home">
          <img src={shown === 'dark' ? '/logo.svg' : '/logo-ink.svg'} alt="typeSirkel" width={101} height={32} />
        </a>
        <nav>
          <label className="lang" data-short={langOf(lang).short}>
            <span className="sr-only">{t.nav.language}</span>
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
          <button type="button" className="theme-flip" onClick={flip} aria-label={shown === 'dark' ? t.nav.toLight : t.nav.toDark} title={shown === 'dark' ? t.nav.toLight : t.nav.toDark}>
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
          <Star label={t.nav.star} />
          <a href={`/write/?lang=${lang}`} className="top-cta">
            {t.nav.openEditor}
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <p className="kicker">{t.hero.kicker}</p>
          <h1 id="hero-title">
            {t.hero.line1}
            <br />
            {t.hero.line2}
          </h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="actions">
            <a href={releases} className={system === 'windows' ? 'button' : 'button solid'}>
              {t.hero.mac}
            </a>
            <a href={releases} className={system === 'windows' ? 'button solid' : 'button'}>
              {t.hero.windows}
            </a>
            <a href={`/write/?lang=${lang}`} className="button bare">
              {t.hero.browser}
            </a>
          </div>
          <p className="fine">{t.hero.fine}</p>
        </section>

        <section className="showcase" aria-label={t.nav.openEditor}>
          <Suspense fallback={<div className="demo demo-waiting" />}>
            <LiveDemo />
          </Suspense>
          <p className="fine">{t.demoNote}</p>
        </section>

        <Agents copy={t.agents} />

        <section className="lookout-demo" aria-labelledby="lookout-title">
          <div className="lookout-copy">
            <p className="kicker">{t.lookout.kicker}</p>
            <h2 id="lookout-title">{t.lookout.title}</h2>
            <p>{t.lookout.body}</p>
            <p className="fine">{t.lookout.hint}</p>
          </div>
          <div className="lookout-stage">
            <Lookout headings={trip} active={stop} onPick={pick} />
          </div>
        </section>

        <section className="features" aria-labelledby="features-title">
          <div className="section-head">
            <p className="kicker">{t.features.kicker}</p>
            <h2 id="features-title">{t.features.title}</h2>
          </div>
          <div className="notes">
            {t.features.notes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="source" aria-labelledby="source-title">
          <div>
            <p className="kicker">{t.source.kicker}</p>
            <h2 id="source-title">{t.source.title}</h2>
            <p>{t.source.body}</p>
            <div className="source-actions">
              <a href={repo} className="button solid">
                {t.source.button}
              </a>
              <Star className="star-large" label={t.nav.star} />
            </div>
          </div>
          <pre>
            <code>{`git clone ${repo}
cd typesirkel
pnpm install
pnpm dev          # browser
pnpm tauri dev    # desktop`}</code>
          </pre>
        </section>
      </main>

      <footer className="foot">
        <span>
          © 2026{' '}
          <a href="https://aconymous.com" title="Hafidz Nc" rel="author">
            Hafidz Nc
          </a>
        </span>
        <span>
          <a href={repo}>GitHub</a> · <a href={`${repo}/blob/main/LICENSE`}>MIT</a> · sirkel.asia
        </span>
      </footer>
    </div>
  )
}
