import './shelf.css'
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react'
import type { Drawer, Leaf } from './drawer'
import type { Recent } from './drawer/recent'
import { onDesktop } from './drawer/tauri'
import { recall, recallShape, remember, rememberShape } from './keep'
import { type Lang, langOf, langs, useLang } from './lang'
import { byCategory, type Prompt } from './prompts'

type Props = {
  drawer: Drawer
  leaves: Leaf[]
  current: string | null
  canFolder: boolean
  outline: ReactNode
  recents: Recent[]
  onReopen: (recent: Recent) => void
  onPrompt: (prompt: Prompt) => void
  onOpen: () => void
  onPick: (leaf: Leaf) => void
  onCreate: (name: string) => void
  onScratch: () => void
  shownTheme: 'light' | 'dark'
  onFlipTheme: () => void
  nudge: boolean
  onNudged: () => void
}

type PaneId = 'outline' | 'prompts' | 'files'

const groupByDir = (leaves: Leaf[]) => {
  const groups = new Map<string, Leaf[]>()
  for (const leaf of leaves) groups.set(leaf.dir, [...(groups.get(leaf.dir) ?? []), leaf])
  return [...groups.entries()].sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
}

// The browser build lives on sirkel.asia, so home is a relative hop there; the
// desktop app hands the link to the system browser instead.
const home = (medium: string) => `/?utm_source=typesirkel&utm_medium=${medium}&utm_campaign=sidebar_logo`

const goHome = async (event: React.MouseEvent) => {
  if (!onDesktop()) return
  event.preventDefault()
  const { openUrl } = await import('@tauri-apps/plugin-opener')
  await openUrl(`https://sirkel.asia${home('desktop')}`)
}

export function HomeLink({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <a className="home-link" href={home('editor')} onClick={(e) => void goHome(e)} aria-label="typeSirkel home">
      <img src={theme === 'dark' ? '/logo.svg' : '/logo-ink.svg'} alt="typeSirkel" width={76} height={24} />
    </a>
  )
}

const shortName = (name: string) => name.replace(/\.(md|markdown|mdx|txt)$/i, '')

const states = ['open', 'shut'] as const

// A folded section stays folded across reloads, the way a drawer stays shut.
const useFold = (key: string) => {
  const [open, setOpen] = useState(() => recall(key, 'open', states) === 'open')
  const toggle = () =>
    setOpen((o) => {
      remember(key, o ? 'shut' : 'open')
      return !o
    })
  return [open, toggle] as const
}

// How the open sections share the height. Weights rather than pixels, so the
// split survives a window being resized or a section being folded.
const balance = { outline: 5, prompts: 3, files: 2 }
const smallest = 64

function Fold({ open }: { open: boolean }) {
  return (
    <svg className={open ? 'fold open' : 'fold'} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M3 2l3 3-3 3" />
    </svg>
  )
}

function Caret() {
  return (
    <svg className="shelf-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2.5 6l2.5-2.5L7.5 6" />
    </svg>
  )
}

export function Shelf({ drawer, leaves, current, canFolder, outline, recents, onReopen, onPrompt, onOpen, onPick, onCreate, onScratch, shownTheme, onFlipTheme, nudge, onNudged }: Props) {
  const [naming, setNaming] = useState(false)
  const [name, setName] = useState('')
  const [filesOpen, toggleFiles] = useFold('shelf-files')
  const [outlineOpen, toggleOutline] = useFold('shelf-outline')
  const [promptsOpen, togglePrompts] = useFold('shelf-prompts')
  const [weights, setWeights] = useState(() => recallShape('shelf-weights', balance))
  const [menu, setMenu] = useState(false)
  const foot = useRef<HTMLDivElement>(null)
  const panes = useRef<Partial<Record<PaneId, HTMLElement | null>>>({})
  const writable = drawer.kind === 'browser' || drawer.kind === 'tauri' || drawer.kind === 'scratch'
  const inFolder = drawer.kind !== 'scratch'
  const [lang, setLang] = useLang()
  const groups = byCategory(lang)

  useEffect(() => {
    if (!menu) return
    const away = (event: PointerEvent) => !foot.current?.contains(event.target as Node) && setMenu(false)
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && setMenu(false)
    window.addEventListener('pointerdown', away)
    window.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('pointerdown', away)
      window.removeEventListener('keydown', escape)
    }
  }, [menu])

  const here = (recent: Recent) => drawer.source && 'path' in drawer.source && 'path' in recent.source && drawer.source.path === recent.source.path

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (name.trim()) onCreate(name)
    setName('')
    setNaming(false)
  }

  const startNaming = () => {
    if (!filesOpen) toggleFiles()
    onNudged()
    setNaming(true)
  }

  const open: Record<PaneId, boolean> = { outline: !!outline && outlineOpen, prompts: promptsOpen, files: filesOpen }

  // Dragging a rule moves height from one open section to the next and
  // nothing else, the way a divider in a drawer would.
  const drag = (above: PaneId, below: PaneId) => (event: React.PointerEvent<HTMLDivElement>) => {
    const top = panes.current[above]
    const bottom = panes.current[below]
    if (!top || !bottom || !open[above] || !open[below]) return
    event.preventDefault()
    const rule = event.currentTarget
    rule.setPointerCapture(event.pointerId)
    const startY = event.clientY
    const a = top.getBoundingClientRect().height
    const b = bottom.getBoundingClientRect().height
    const total = weights[above] + weights[below]
    let next = weights
    const move = (e: PointerEvent) => {
      const height = Math.min(Math.max(a + e.clientY - startY, smallest), a + b - smallest)
      const share = (height / (a + b)) * total
      next = { ...weights, [above]: share, [below]: total - share }
      setWeights(next)
    }
    const end = () => {
      rule.removeEventListener('pointermove', move)
      rule.removeEventListener('pointerup', end)
      rule.removeEventListener('pointercancel', end)
      rememberShape('shelf-weights', next)
    }
    rule.addEventListener('pointermove', move)
    rule.addEventListener('pointerup', end)
    rule.addEventListener('pointercancel', end)
  }

  const nudgeRule = (above: PaneId, below: PaneId) => (event: React.KeyboardEvent) => {
    const step = event.key === 'ArrowUp' ? -0.25 : event.key === 'ArrowDown' ? 0.25 : 0
    if (!step || !open[above] || !open[below]) return
    event.preventDefault()
    const total = weights[above] + weights[below]
    const share = Math.min(Math.max(weights[above] + step, total * 0.1), total * 0.9)
    const next = { ...weights, [above]: share, [below]: total - share }
    setWeights(next)
    rememberShape('shelf-weights', next)
  }

  const reset = () => {
    setWeights(balance)
    rememberShape('shelf-weights', balance)
  }

  const sizeOf = (id: PaneId) => (open[id] ? { flex: `${weights[id]} 1 0px` } : undefined)

  const sections: { id: PaneId; node: ReactNode }[] = []

  if (outline) {
    sections.push({
      id: 'outline',
      node: (
        <section className={`shelf-pane${outlineOpen ? ' is-open' : ''}`} style={sizeOf('outline')} ref={(el) => void (panes.current.outline = el)}>
          <div className="shelf-pane-head">
            <button type="button" className="shelf-toggle" onClick={toggleOutline} aria-expanded={outlineOpen}>
              <Fold open={outlineOpen} />
              <span>On this page</span>
            </button>
          </div>
          {outlineOpen ? <div className="shelf-pane-body">{outline}</div> : null}
        </section>
      ),
    })
  }

  sections.push({
    id: 'prompts',
    node: (
      <section className={`shelf-pane shelf-prompts${promptsOpen ? ' is-open' : ''}`} style={sizeOf('prompts')} ref={(el) => void (panes.current.prompts = el)}>
        <div className="shelf-pane-head">
          <button type="button" className="shelf-toggle" onClick={togglePrompts} aria-expanded={promptsOpen}>
            <Fold open={promptsOpen} />
            <span>Prompts</span>
          </button>
          <label className="shelf-lang" title="Prompt language">
            <span className="sr-only">Prompt language</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              {langs.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <b aria-hidden="true">{langOf(lang).short}</b>
          </label>
        </div>
        {promptsOpen ? (
          <div className="shelf-pane-body">
            {groups.map(({ label, prompts }) => (
              <section key={label}>
                <p className="shelf-dir">{label}</p>
                <ul>
                  {prompts.map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => onPrompt(p)} title={p.description}>
                        {p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}
      </section>
    ),
  })

  sections.push({
    id: 'files',
    node: (
      <section className={`shelf-pane shelf-files${filesOpen ? ' is-open' : ''}`} style={sizeOf('files')} ref={(el) => void (panes.current.files = el)}>
        <div className="shelf-pane-head">
          <button type="button" className="shelf-toggle" onClick={toggleFiles} aria-expanded={filesOpen}>
            <Fold open={filesOpen} />
            <span>{inFolder ? 'Files' : 'Scratch'}</span>
          </button>
          {writable ? (
            <button type="button" className={`shelf-add${nudge ? ' is-nudged' : ''}`} onClick={startNaming} aria-label="New file" title="New file">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M7 2v10M2 7h10" />
              </svg>
            </button>
          ) : null}
        </div>
        {filesOpen ? (
          <div className="shelf-pane-body shelf-list">
            {naming ? (
              <form onSubmit={submit} className="shelf-new">
                <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={() => !name && setNaming(false)} onKeyDown={(e) => e.key === 'Escape' && setNaming(false)} aria-label="File name" />
              </form>
            ) : null}
            {groupByDir(leaves).map(([dir, group]) => (
              <section key={dir || '.'}>
                {dir ? <p className="shelf-dir">{dir}</p> : null}
                <ul>
                  {group.map((leaf) => (
                    <li key={leaf.path}>
                      <button type="button" className={leaf.path === current ? 'here' : undefined} onClick={() => onPick(leaf)} title={leaf.path}>
                        {shortName(leaf.name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {leaves.length === 0 ? <p className="shelf-empty">No markdown files</p> : null}
          </div>
        ) : null}
      </section>
    ),
  })

  const opener = canFolder ? 'Open folder' : 'Open file'

  return (
    <nav className="shelf" aria-label="Sidebar">
      <div className="shelf-brand">
        <HomeLink theme={shownTheme} />
        <button type="button" className="theme-flip" onClick={onFlipTheme} aria-label={shownTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={shownTheme === 'dark' ? 'Light theme' : 'Dark theme'}>
          {shownTheme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="3.2" />
              <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z" />
            </svg>
          )}
        </button>
      </div>

      <div className="shelf-stack">
        {sections.map((section, i) => {
          const above = sections[i - 1]?.id
          const live = above ? open[above] && open[section.id] : false
          return (
            <Fragment key={section.id}>
              {above ? (
                <div
                  className={`shelf-rule${live ? ' is-live' : ''}`}
                  role="separator"
                  aria-orientation="horizontal"
                  aria-label="Resize sections"
                  tabIndex={live ? 0 : -1}
                  onPointerDown={drag(above, section.id)}
                  onKeyDown={nudgeRule(above, section.id)}
                  onDoubleClick={reset}
                />
              ) : null}
              {section.node}
            </Fragment>
          )
        })}
      </div>

      <div className="shelf-foot" ref={foot}>
        {inFolder ? (
          <button type="button" className="shelf-folder" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-haspopup="menu" title={drawer.label}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M1.75 4.25c0-.69.56-1.25 1.25-1.25h3.1l1.5 1.6h5.4c.69 0 1.25.56 1.25 1.25v6.4c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25z" />
            </svg>
            <span>{drawer.label}</span>
            <Caret />
          </button>
        ) : (
          <div className="shelf-opener">
            <button type="button" className="line-button" onClick={onOpen}>
              {opener}
            </button>
            {recents.length ? (
              <button type="button" className="shelf-recent" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-haspopup="menu" aria-label="Recent folders" title="Recent folders">
                <Caret />
              </button>
            ) : null}
          </div>
        )}
        {menu ? (
          <div className="shelf-menu" role="menu">
            {recents.map((r) => (
              <button
                key={r.id}
                type="button"
                role="menuitem"
                className={here(r) || (drawer.kind === 'browser' && drawer.label === r.label) ? 'here' : undefined}
                title={'path' in r.source ? r.source.path : r.label}
                onClick={() => {
                  setMenu(false)
                  onReopen(r)
                }}
              >
                {r.label}
              </button>
            ))}
            {recents.length ? <hr /> : null}
            {inFolder ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenu(false)
                  onScratch()
                }}
              >
                Scratch
              </button>
            ) : null}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenu(false)
                onOpen()
              }}
            >
              {opener}…
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
