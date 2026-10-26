import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { Heading } from '../ink'
import type { Lang } from '../lang'
import { Lookout } from '../Lookout'
import { Agents } from './Agents'
import { copies } from './copy'
import { downloads, marks, type System, systems } from './downloads'
import { repo, SiteFooter, SiteHeader, useHead } from '../site/Chrome'
import { editorFrom } from '../site/pages'
import { Star } from './Star'

// The real editor, loaded after the page has painted so the hero never waits on CodeMirror.
const LiveDemo = lazy(() => import('./LiveDemo'))

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

const guessSystem = (): System => {
  const agent = navigator.userAgent
  if (/Windows/.test(agent)) return 'windows'
  if (/Linux/.test(agent) && !/Android/.test(agent)) return 'linux'
  return 'mac'
}

export function Landing({ lang }: { lang: Lang }) {
  const [system, setSystem] = useState<System>('mac')
  const [stop, setStop] = useState(0)
  const [held, setHeld] = useState(false)
  const t = copies[lang]

  const trip: Heading[] = useMemo(() => trail.map((s, i) => ({ id: `stop-${i}`, text: t.lookout.stops[i], ...s })), [t])

  useEffect(() => setSystem(guessSystem()), [])

  useHead(lang, t.meta.title, t.meta.description)

  // The demo walks on its own until someone takes over.
  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const walk = window.setInterval(() => setStop((s) => (s + 1) % trail.length), 1800)
    return () => window.clearInterval(walk)
  }, [held])

  const pick = (heading: Heading) => {
    setHeld(true)
    setStop(trip.findIndex((h) => h.id === heading.id))
  }

  return (
    <div className="landing">
      <SiteHeader lang={lang} page="home" />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">
            <span>{t.hero.line1}</span> <span>{t.hero.line2}</span>
          </h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="actions">
            {systems.map((each) => (
              <a key={each} href={downloads[each]} className={each === system ? 'button solid' : 'button'}>
                <svg className="os-mark" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d={marks[each]} />
                </svg>
                {t.hero[each]}
              </a>
            ))}
            <a href={editorFrom(lang, 'home', 'hero_browser')} className="button bare">
              {t.hero.browser}
            </a>
          </div>
          <p className="fine">{t.hero.fine}</p>
        </section>

        <section className="showcase" aria-label={t.nav.openEditor}>
          <Suspense fallback={<div className="demo demo-waiting" />}>
            <LiveDemo lang={lang} />
          </Suspense>
        </section>

        <Agents copy={t.agents} />

        <section className="lookout-demo" aria-labelledby="lookout-title">
          <div className="lookout-copy">
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

      <SiteFooter lang={lang} />
    </div>
  )
}
