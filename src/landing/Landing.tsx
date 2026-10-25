import { useEffect, useState } from 'react'
import type { Heading } from '../ink'
import { Lookout } from '../Lookout'

const repo = 'https://github.com/aconymouse/typesirkel'
const releases = `${repo}/releases/latest`

// A pretend document, just enough for the eye to have somewhere to walk.
const trip: Heading[] = [
  { id: 'chapter', level: 1, text: 'Chapter one', line: 0 },
  { id: 'arrival', level: 2, text: 'Arrival', line: 4 },
  { id: 'the-harbour', level: 3, text: 'The harbour', line: 9 },
  { id: 'the-market', level: 3, text: 'The market', line: 15 },
  { id: 'nightfall', level: 2, text: 'Nightfall', line: 22 },
  { id: 'a-letter', level: 3, text: 'A letter home', line: 28 },
  { id: 'morning', level: 2, text: 'Morning', line: 35 },
]

const notes = [
  { title: 'Plain files', body: 'Point it at a folder. Every note stays a .md file you can open in anything, back up anywhere, and keep forever.' },
  { title: 'Write and read at once', body: 'The editor and the preview sit side by side and keep their place together. Or hide either one when you need the room.' },
  { title: 'Bring your own AI', body: 'Plug in a key from Anthropic, OpenAI or OpenRouter, or a local Ollama. Continue, tighten, fix or translate a passage without leaving the page.' },
  { title: 'Write together', body: 'Share a link and edit the same draft live, cursors and all. Everything is sealed in your browser before it travels, so the relay never reads a word.' },
  { title: 'Works with your agents', body: 'A small MCP server lets Claude, Cursor or any MCP client read and write your folder. The desktop app picks up their edits as they land.' },
  { title: 'Export when ready', body: 'Hand off a clean standalone HTML page, or print to PDF with the same typography you read in the app.' },
]

type System = 'mac' | 'windows' | 'other'

const guessSystem = (): System => {
  const agent = navigator.userAgent
  if (/Mac|iPhone|iPad/.test(agent)) return 'mac'
  if (/Windows/.test(agent)) return 'windows'
  return 'other'
}

export function Landing() {
  const [system, setSystem] = useState<System>('other')
  const [stop, setStop] = useState(0)
  const [held, setHeld] = useState(false)

  useEffect(() => setSystem(guessSystem()), [])

  // The demo walks on its own until someone takes over.
  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const walk = window.setInterval(() => setStop((s) => (s + 1) % trip.length), 1800)
    return () => window.clearInterval(walk)
  }, [held])

  const pick = (heading: Heading) => {
    setHeld(true)
    setStop(trip.findIndex((h) => h.id === heading.id))
  }

  return (
    <div className="landing">
      <header className="top">
        <a href="/" className="brand" aria-label="typeSirkel home">
          <img src="/mark.svg" alt="" width={26} height={26} />
          <span>typeSirkel</span>
        </a>
        <nav>
          <a href={repo}>GitHub</a>
          <a href="/write/" className="top-cta">
            Open editor
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <p className="kicker">Free and open source markdown editor</p>
          <h1>
            Write in folders.
            <br />
            Read as you go.
          </h1>
          <p className="lead">typeSirkel keeps your notes as plain markdown files on your own disk, shows a live preview beside you, and lets a small eye follow you through your headings.</p>
          <div className="actions">
            <a href={releases} className={system === 'windows' ? 'button' : 'button solid'}>
              Download for Mac
            </a>
            <a href={releases} className={system === 'windows' ? 'button solid' : 'button'}>
              Download for Windows
            </a>
            <a href="/write/" className="button bare">
              Try it in your browser →
            </a>
          </div>
          <p className="fine">macOS 11 or newer, Windows 10 or newer, or any Chromium browser. MIT licensed.</p>
        </section>

        <figure className="shot">
          <picture>
            <source srcSet="/shots/editor-dark.webp" media="(prefers-color-scheme: dark)" />
            <img src="/shots/editor-light.webp" alt="typeSirkel with a folder of notes on the left, the editor and preview side by side, and the outline on the right" width={2400} height={1433} />
          </picture>
        </figure>

        <section className="lookout-demo">
          <div className="lookout-copy">
            <p className="kicker">The lookout</p>
            <h2>Always know where you are in a long draft.</h2>
            <p>Your headings become stops on a trail. As you write or scroll, the eye walks to the section you are in. The road behind you is drawn in, the road ahead is still dotted. Click any stop to jump there.</p>
            <p className="fine">Go on, click a heading.</p>
          </div>
          <div className="lookout-stage">
            <Lookout headings={trip} active={stop} onPick={pick} />
          </div>
        </section>

        <section className="notes" aria-label="Features">
          {notes.map((note) => (
            <article key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </article>
          ))}
        </section>

        <section className="source">
          <div>
            <p className="kicker">Open source</p>
            <h2>Read the code. Change it. Make it yours.</h2>
            <p>typeSirkel is MIT licensed and small enough to understand in an afternoon. The editor is CodeMirror, the desktop shell is Tauri, and everything else is a few calm React files named after things on a writing desk.</p>
            <a href={repo} className="button solid">
              View on GitHub
            </a>
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
        <span>© 2026 Hafidz Nc</span>
        <span>
          <a href={repo}>GitHub</a> · <a href={`${repo}/blob/main/LICENSE`}>MIT</a> · sirkel.asia
        </span>
      </footer>
    </div>
  )
}
