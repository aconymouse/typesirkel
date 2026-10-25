import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { type Drawer, folderSupport, type Leaf, openDrawer, scratchDrawer } from './drawer'
import { counts, ink, titleOf } from './ink'
import { recall, remember } from './keep'
import { Lookout } from './Lookout'
import { pressHtml, pressMarkdown, pressPdf } from './press'
import { Proof, type ProofHandle } from './Proof'
import { Sheet, type SheetHandle } from './Sheet'
import { Shelf } from './Shelf'

const modes = ['write', 'split', 'read'] as const
const themes = ['system', 'light', 'dark'] as const
type Mode = (typeof modes)[number]
type Theme = (typeof themes)[number]
type SaveState = 'saved' | 'dirty' | 'saving' | 'failed' | 'loose'

const settle = 700

export function Desk() {
  const [drawer, setDrawer] = useState<Drawer>(() => scratchDrawer())
  const [leaves, setLeaves] = useState<Leaf[]>([])
  const [current, setCurrent] = useState<Leaf | null>(null)
  const [text, setText] = useState('')
  const [docKey, setDocKey] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [mode, setMode] = useState<Mode>(() => recall('mode', 'split', modes))
  const [theme, setTheme] = useState<Theme>(() => recall('theme', 'system', themes))
  const [quiet, setQuiet] = useState(false)
  const [focusLine, setFocusLine] = useState(0)
  const [pressing, setPressing] = useState(false)

  const sheet = useRef<SheetHandle>(null)
  const proof = useRef<ProofHandle>(null)
  const pending = useRef<{ timer: number; drawer: Drawer; path: string; text: string } | null>(null)
  const modeRef = useRef(mode)
  modeRef.current = mode

  const deferred = useDeferredValue(text)
  const inked = useMemo(() => ink(deferred), [deferred])
  const tally = useMemo(() => counts(deferred), [deferred])

  const active = useMemo(() => {
    let found = -1
    inked.headings.forEach((heading, i) => {
      if (heading.line <= focusLine) found = i
    })
    return found
  }, [inked.headings, focusLine])

  const write = useCallback(async (target: Drawer, path: string, body: string) => {
    setSaveState('saving')
    try {
      await target.write(path, body)
      setSaveState(target.kind === 'loose' ? 'loose' : 'saved')
    } catch {
      setSaveState('failed')
    }
  }, [])

  // Anything still waiting gets written before we look away from it.
  const flush = useCallback(async () => {
    const job = pending.current
    if (!job) return
    window.clearTimeout(job.timer)
    pending.current = null
    await write(job.drawer, job.path, job.text)
  }, [write])

  const load = useCallback(
    async (target: Drawer, leaf: Leaf | null) => {
      await flush()
      const body = leaf ? await target.read(leaf.path) : ''
      setCurrent(leaf)
      setText(body)
      setDocKey(`${target.label}:${leaf?.path ?? ''}:${Date.now()}`)
      setFocusLine(0)
      setSaveState(target.kind === 'loose' ? 'loose' : 'saved')
    },
    [flush],
  )

  const shelve = useCallback(
    async (target: Drawer, preferred?: string) => {
      const found = await target.list()
      setDrawer(target)
      setLeaves(found)
      const first = found.find((l) => l.path === preferred) ?? found.find((l) => /^readme\.md$/i.test(l.name)) ?? found[0] ?? null
      await load(target, first)
    },
    [load],
  )

  useEffect(() => {
    void shelve(scratchDrawer())
  }, [shelve])

  const change = (value: string) => {
    setText(value)
    if (!current) return
    if (pending.current) window.clearTimeout(pending.current.timer)
    setSaveState(drawer.kind === 'loose' ? 'loose' : 'dirty')
    const job = { drawer, path: current.path, text: value, timer: 0 }
    job.timer = window.setTimeout(() => {
      if (pending.current === job) pending.current = null
      void write(job.drawer, job.path, job.text)
    }, settle)
    pending.current = job
  }

  const openFolder = async () => {
    await flush()
    const next = await openDrawer()
    if (next) await shelve(next)
  }

  const create = async (name: string) => {
    const leaf = await drawer.create(name)
    await shelve(drawer, leaf.path)
  }

  const save = async () => {
    if (drawer.kind === 'loose' && current) {
      await pressMarkdown(text, current.name)
      return
    }
    await flush()
  }

  const followCursor = (line: number) => {
    setFocusLine(line)
    if (modeRef.current === 'split') proof.current?.showLine(line)
  }

  const followSheetScroll = (line: number) => {
    if (modeRef.current !== 'split') return
    proof.current?.showLine(line)
  }

  const followProof = (line: number) => setFocusLine(line)

  const pick = (heading: { line: number; id: string }) => {
    setFocusLine(heading.line)
    if (mode !== 'read') sheet.current?.jump(heading.line)
    if (mode !== 'write') proof.current?.showId(heading.id)
  }

  useEffect(() => {
    remember('mode', mode)
  }, [mode])

  useEffect(() => {
    remember('theme', theme)
    if (theme === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const name = current ? titleOf(deferred, current.name) : 'typeSirkel'
    document.title = current ? `${name} · typeSirkel` : 'typeSirkel'
  }, [current, deferred])

  useEffect(() => {
    const leave = (event: BeforeUnloadEvent) => {
      if (pending.current) {
        void flush()
        event.preventDefault()
      }
    }
    window.addEventListener('beforeunload', leave)
    return () => window.removeEventListener('beforeunload', leave)
  }, [flush])

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return
      const key = event.key.toLowerCase()
      const run = (fn: () => void) => {
        event.preventDefault()
        fn()
      }
      if (key === 's') run(() => void save())
      else if (key === 'o') run(() => void openFolder())
      else if (key === 'p') run(pressPdf)
      else if (key === '.') run(() => setQuiet((q) => !q))
      else if (key === '1') run(() => setMode('write'))
      else if (key === '2') run(() => setMode('split'))
      else if (key === '3') run(() => setMode('read'))
    }
    window.addEventListener('keydown', keys)
    return () => window.removeEventListener('keydown', keys)
  })

  const stateLabel: Record<SaveState, string> = {
    saved: 'Saved',
    dirty: 'Editing',
    saving: 'Saving',
    failed: 'Could not save',
    loose: 'Cmd/Ctrl+S to download',
  }

  return (
    <div className={`desk mode-${mode}${quiet ? ' quiet' : ''}`}>
      <div className="grip" data-tauri-drag-region aria-hidden="true" />
      {!quiet ? <Shelf drawer={drawer} leaves={leaves} current={current?.path ?? null} canFolder={folderSupport() === 'folder'} onOpen={openFolder} onPick={(leaf) => void load(drawer, leaf)} onCreate={(name) => void create(name)} onScratch={() => void shelve(scratchDrawer())} /> : null}

      <main className="work">
        <div className="panes">
          {current ? (
            <>
              <section className="pane pane-sheet" aria-label="Editor" hidden={mode === 'read'}>
                <Sheet ref={sheet} docKey={docKey} text={text} onChange={change} onCursor={followCursor} onScrollLine={followSheetScroll} />
              </section>
              <section className="pane pane-proof" aria-label="Preview" hidden={mode === 'write'}>
                <Proof ref={proof} html={inked.html} onScrollLine={followProof} />
              </section>
            </>
          ) : (
            <div className="empty">
              <p>Nothing open.</p>
              <button type="button" className="line-button" onClick={openFolder}>
                {folderSupport() === 'folder' ? 'Open a folder' : 'Open a file'}
              </button>
            </div>
          )}
        </div>

        <footer className="bar">
          <span className={`bar-state state-${saveState}`}>{stateLabel[saveState]}</span>
          <span className="bar-path" title={current?.path}>
            {current?.path}
          </span>
          <span className="bar-count">
            {tally.words.toLocaleString()} words · {tally.minutes} min
          </span>
          <div className="bar-modes" role="group" aria-label="View">
            {modes.map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                {m}
              </button>
            ))}
          </div>
          <div className="bar-tools">
            <div className="press">
              <button type="button" className="quiet-button text" onClick={() => setPressing((p) => !p)} aria-expanded={pressing}>
                Export
              </button>
              {pressing ? (
                <div className="press-menu" onMouseLeave={() => setPressing(false)}>
                  <button type="button" onClick={() => { setPressing(false); void pressHtml(titleOf(text, current?.name ?? 'untitled'), inked.html, current?.name ?? 'untitled.md') }}>
                    HTML page
                  </button>
                  <button type="button" onClick={() => { setPressing(false); pressPdf() }}>
                    PDF (print)
                  </button>
                  <button type="button" onClick={() => { setPressing(false); void pressMarkdown(text, current?.name ?? 'untitled.md') }}>
                    Markdown copy
                  </button>
                </div>
              ) : null}
            </div>
            <button type="button" className="quiet-button text" onClick={() => setTheme(themes[(themes.indexOf(theme) + 1) % themes.length])} title="Theme">
              {theme}
            </button>
            <button type="button" className="quiet-button text" aria-pressed={quiet} onClick={() => setQuiet((q) => !q)} title="Quiet mode (Mod+.)">
              quiet
            </button>
          </div>
        </footer>
      </main>

      {!quiet && current ? <Lookout headings={inked.headings} active={active} onPick={pick} /> : null}
    </div>
  )
}
