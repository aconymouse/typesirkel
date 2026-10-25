import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { type Circle, joinCircle, type Person, readInvite, somebody, startCircle } from './circle/circle'
import { CirclePanel } from './circle/CirclePanel'
import { circleDrawer } from './circle/drawer'
import { type Drawer, folderSupport, type Leaf, openDrawer, scratchDrawer } from './drawer'
import { counts, ink, titleOf } from './ink'
import { recall, recallShape, remember, rememberShape } from './keep'
import { Lookout } from './Lookout'
import { forgetFolder, type Recent, recentFolders, rememberFolder, reopenFolder } from './drawer/recent'
import { PromptCard } from './PromptCard'
import type { Prompt } from './prompts'
import { Quill } from './quill/Quill'
import type { Tool } from './quill/voices'
import { desktopDrawer, onDesktop } from './drawer/tauri'
import { pressHtml, pressMarkdown, pressPdf } from './press'
import { Proof, type ProofHandle } from './Proof'
import { Sheet, type SheetHandle } from './Sheet'
import { Shelf } from './Shelf'

const modes = ['write', 'split', 'read'] as const
const themes = ['system', 'light', 'dark'] as const
type Mode = (typeof modes)[number]
type Theme = (typeof themes)[number]
type Side = 'none' | 'quill' | 'circle'
type SaveState = 'saved' | 'dirty' | 'saving' | 'failed' | 'loose' | 'live'

const settle = 700

const stamp = (target: Drawer, leaf: Leaf | null) => `${target.label}:${leaf?.path ?? ''}:${Date.now()}`

const reason = (error: unknown) => (error instanceof Error ? error.message : String(error))

export function Desk() {
  const [drawer, setDrawer] = useState<Drawer>(() => scratchDrawer())
  const [leaves, setLeaves] = useState<Leaf[]>([])
  const [current, setCurrent] = useState<Leaf | null>(null)
  const [text, setText] = useState('')
  const [docKey, setDocKey] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [mode, setMode] = useState<Mode>(() => recall('mode', 'split', modes))
  const [theme, setTheme] = useState<Theme>(() => recall('theme', 'system', themes))
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [quiet, setQuiet] = useState(false)
  const [side, setSide] = useState<Side>('none')
  const [focusLine, setFocusLine] = useState(0)
  const [pressing, setPressing] = useState(false)
  const [shelfOpen, setShelfOpen] = useState(false)
  const [quillOpened, setQuillOpened] = useState(false)
  const [recents, setRecents] = useState<Recent[]>([])
  const [card, setCard] = useState<Prompt | null>(null)
  const [style, setStyle] = useState<Prompt | null>(null)
  const [quillBusy, setQuillBusy] = useState<string | null>(null)
  const [circle, setCircle] = useState<Circle | null>(null)
  const [hosting, setHosting] = useState(false)
  const [shareBusy, setShareBusy] = useState(false)
  const [shareError, setShareError] = useState('')
  const [me, setMe] = useState<Person>(() => recallShape('me', somebody()))

  const sheet = useRef<SheetHandle>(null)
  const proof = useRef<ProofHandle>(null)
  const pending = useRef<{ timer: number; drawer: Drawer; path: string; text: string } | null>(null)
  const circleRef = useRef<Circle | null>(null)
  circleRef.current = circle
  const drawerRef = useRef(drawer)
  drawerRef.current = drawer
  const currentRef = useRef(current)
  currentRef.current = current
  const textRef = useRef(text)
  textRef.current = text
  const echo = useRef<string | null>(null)
  const modeRef = useRef(mode)
  modeRef.current = mode

  const deferred = useDeferredValue(text)
  const inked = useMemo(() => ink(deferred), [deferred])
  const tally = useMemo(() => counts(deferred), [deferred])
  const shared = useMemo(() => circle?.shared, [circle])

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

  // Sharing belongs to one document. Walking away from it closes the circle.
  const dropCircle = useCallback(() => {
    circleRef.current?.close()
    circleRef.current = null
    setCircle(null)
    setHosting(false)
    if (readInvite(location.hash)) history.replaceState(null, '', location.pathname + location.search)
  }, [])

  const load = useCallback(
    async (target: Drawer, leaf: Leaf | null) => {
      await flush()
      if (circleRef.current) dropCircle()
      const body = leaf ? await target.read(leaf.path) : ''
      setCurrent(leaf)
      setText(body)
      setDocKey(stamp(target, leaf))
      setFocusLine(0)
      setSaveState(target.kind === 'loose' ? 'loose' : 'saved')
    },
    [flush, dropCircle],
  )

  const shelve = useCallback(
    async (target: Drawer, preferred?: string) => {
      const found = await target.list()
      setDrawer(target)
      setLeaves(found)
      if (target.source) void rememberFolder(target).then(() => recentFolders().then(setRecents))
      const first = found.find((l) => l.path === preferred) ?? found.find((l) => /^readme\.md$/i.test(l.name)) ?? found[0] ?? null
      await load(target, first)
    },
    [load],
  )

  const join = useCallback(
    async (invite: { room: string; secret: string }) => {
      await flush()
      setShareBusy(true)
      setShareError('')
      setSide('circle')
      try {
        const joined = await joinCircle(invite, me)
        if (circleRef.current) dropCircle()
        const target = circleDrawer(joined)
        const [leaf] = await target.list()
        circleRef.current = joined
        setCircle(joined)
        setHosting(false)
        setDrawer(target)
        setLeaves([leaf])
        setCurrent(leaf)
        setText(joined.text.toString())
        setDocKey(stamp(target, leaf))
        setFocusLine(0)
        setSaveState('live')
        history.replaceState(null, '', `${location.pathname}${location.search}#circle=${invite.room}.${invite.secret}`)
        return true
      } catch (error) {
        setShareError(`Could not join: ${reason(error)}`)
        return false
      } finally {
        setShareBusy(false)
      }
    },
    [flush, me, dropCircle],
  )

  // React runs mount effects twice while developing. Opening the desk must not
  // join the same room twice.
  const opened = useRef(false)

  useEffect(() => {
    if (opened.current) return
    opened.current = true
    const invite = readInvite(location.hash)
    void (async () => {
      if (invite && (await join(invite))) return
      if (invite) history.replaceState(null, '', location.pathname + location.search)
      await shelve(scratchDrawer())
    })()
    // Only the address the app was opened with counts; later hash changes are ours.
  }, [])

  const startSharing = async () => {
    if (!current) return
    await flush()
    setShareBusy(true)
    setShareError('')
    try {
      const opened = await startCircle(text, me)
      circleRef.current = opened
      setCircle(opened)
      setHosting(true)
      setDocKey(stamp(drawer, current))
    } catch (error) {
      setShareError(`Could not start sharing: ${reason(error)}`)
    } finally {
      setShareBusy(false)
    }
  }

  const stopSharing = () => {
    const wasHosting = hosting
    dropCircle()
    if (wasHosting) setDocKey(stamp(drawer, current))
    else void shelve(scratchDrawer())
  }

  const rename = (next: Person) => {
    setMe(next)
    circleRef.current?.rename(next)
  }

  useEffect(() => rememberShape('me', me), [me])

  const change = (value: string) => {
    setText(value)
    // A change that came from disk is already on disk. Writing it back would
    // only wake the watcher again.
    if (echo.current === value) {
      echo.current = null
      return
    }
    if (!current || drawer.kind === 'circle') return
    if (pending.current) window.clearTimeout(pending.current.timer)
    setSaveState(drawer.kind === 'loose' ? 'loose' : 'dirty')
    const job = { drawer, path: current.path, text: value, timer: 0 }
    job.timer = window.setTimeout(() => {
      if (pending.current === job) pending.current = null
      void write(job.drawer, job.path, job.text)
    }, settle)
    pending.current = job
  }

  useEffect(() => {
    if (!drawer.watch) return
    let alive = true
    let stop: (() => void) | undefined
    void drawer
      .watch(async (paths) => {
        setLeaves(await drawer.list())
        const leaf = currentRef.current
        if (!leaf || !paths.includes(leaf.path) || pending.current || circleRef.current) return
        const disk = await drawer.read(leaf.path).catch(() => null)
        if (disk === null || disk === textRef.current) return
        echo.current = disk
        sheet.current?.refill(disk)
      })
      .then((unwatch) => {
        if (alive) stop = unwatch
        else unwatch()
      })
      .catch(() => {})
    return () => {
      alive = false
      stop?.()
    }
  }, [drawer])

  const openFolder = async () => {
    await flush()
    const next = await openDrawer()
    if (next) await shelve(next)
  }

  useEffect(() => {
    void recentFolders().then(setRecents)
  }, [])

  // A remembered folder may have been moved or deleted since. Then it leaves the list.
  const reopen = async (recent: Recent) => {
    await flush()
    try {
      const next = await reopenFolder(recent)
      if (next) await shelve(next)
    } catch {
      await forgetFolder(recent.id)
      setRecents(await recentFolders())
    }
  }

  const create = async (name: string) => {
    const leaf = await drawer.create(name)
    await shelve(drawer, leaf.path)
  }

  const save = async () => {
    if ((drawer.kind === 'loose' || drawer.kind === 'circle') && current) {
      await pressMarkdown(text, drawer.kind === 'circle' ? `${titleOf(text, 'shared')}.md` : current.name)
      return
    }
    await flush()
  }

  // Typing scrolls the sheet too. For a moment after the cursor moves, the
  // cursor decides where the reader is; after that, scrolling does.
  const cursorMoved = useRef(0)

  const followCursor = (line: number) => {
    cursorMoved.current = performance.now()
    setFocusLine(line)
    if (modeRef.current === 'split') proof.current?.showLine(line)
  }

  const followSheetScroll = (line: number) => {
    if (performance.now() - cursorMoved.current > 500) setFocusLine(line)
    if (modeRef.current === 'split') proof.current?.showLine(line)
  }

  const followProof = (line: number) => setFocusLine(line)

  const pick = (heading: { line: number; id: string }) => {
    setFocusLine(heading.line)
    if (mode !== 'read') sheet.current?.jump(heading.line)
    if (mode !== 'write') proof.current?.showId(heading.id)
  }

  const toggleSide = (next: Side) => {
    if (next === 'quill') setQuillOpened(true)
    setSide((s) => (s === next ? 'none' : next))
  }

  // Where Quill writes. It starts as the open folder and can be pointed at
  // another one by name, without pulling the shelf away from the writer.
  const workspace = useRef<Drawer>(drawer)
  const [away, setAway] = useState<Drawer | null>(null)
  const quillBusyRef = useRef<string | null>(null)
  quillBusyRef.current = quillBusy
  // Opening another folder while Quill works must not redirect what it is writing.
  useEffect(() => {
    if (quillBusyRef.current) {
      if (workspace.current !== drawer) setAway(workspace.current)
      return
    }
    workspace.current = drawer
    setAway(null)
  }, [drawer])

  const writable = (target: Drawer) => target.kind === 'browser' || target.kind === 'tauri'

  // A name already taken gets a number instead of being written over.
  const fileInto = async (name: string, body: string, target: Drawer = workspace.current) => {
    if (!writable(target)) throw new Error('No folder is open. Ask the writer to open one with Open folder.')
    const taken = new Set((await target.list()).map((l) => l.path.toLowerCase()))
    const dot = name.lastIndexOf('.')
    const stem = dot > 0 ? name.slice(0, dot) : name
    const ext = dot > 0 ? name.slice(dot) : '.md'
    let candidate = name
    for (let n = 2; taken.has(candidate.toLowerCase()); n++) candidate = `${stem}-${n}${ext}`
    const leaf = await target.create(candidate)
    await target.write(leaf.path, body)
    if (target === drawerRef.current) {
      setLeaves(await target.list())
      // Follow the work as it lands, unless the writer has unsaved typing open.
      if (!pending.current) await load(target, leaf)
    }
    return leaf.path
  }

  const text_ = (input: Record<string, unknown>, key: string) => (typeof input[key] === 'string' ? (input[key] as string) : '')

  const tools: Tool[] = [
    {
      name: 'list_files',
      description: 'List the markdown files in the folder Quill is working in.',
      schema: { type: 'object', properties: {} },
      run: async () => {
        const target = workspace.current
        if (!writable(target)) return 'No folder is open.'
        const found = await target.list()
        return found.length ? found.map((l) => l.path).join('\n') : 'The folder is empty.'
      },
    },
    {
      name: 'read_file',
      description: 'Read one markdown file from the folder.',
      schema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
      run: (input) => workspace.current.read(text_(input, 'path')),
    },
    {
      name: 'create_file',
      description: 'Create a new markdown file in the folder. Existing files are never overwritten; a taken name gets a number. Returns the path written.',
      schema: { type: 'object', properties: { name: { type: 'string', description: 'File name, for example 01-intro-html.md' }, content: { type: 'string' } }, required: ['name', 'content'] },
      run: (input) => {
        const name = text_(input, 'name').trim()
        const content = text_(input, 'content').trim()
        if (!name || !content) throw new Error('create_file needs both a name and the full content.')
        return fileInto(name, `${content}\n`)
      },
    },
    {
      name: 'edit_draft',
      description: 'Change the draft that is open in the editor: replace all of it, or append to its end. The writer can undo it.',
      schema: { type: 'object', properties: { mode: { type: 'string', enum: ['replace', 'append'] }, content: { type: 'string' } }, required: ['mode', 'content'] },
      run: async (input) => {
        if (!sheet.current || !currentRef.current) throw new Error('No draft is open in the editor.')
        if (modeRef.current === 'read') setMode('split')
        const how = text_(input, 'mode') === 'append' ? 'end' : 'all'
        sheet.current.land({ from: 0, to: 0, text: '', before: '', whole: '' }, text_(input, 'content'), how)
        return 'Done'
      },
    },
    ...(onDesktop()
      ? [
          {
            name: 'use_folder',
            description: 'Work in a folder on this computer from now on, creating it if it does not exist. Accepts paths like ~/Documents/notes.',
            schema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
            run: async (input: Record<string, unknown>) => {
              const [{ homeDir, isAbsolute, join }, fs] = await Promise.all([import('@tauri-apps/api/path'), import('@tauri-apps/plugin-fs')])
              const home = await homeDir()
              let path = text_(input, 'path').trim()
              if (path === '~' || path.startsWith('~/')) path = await join(home, path.slice(2))
              else if (!(await isAbsolute(path))) path = await join(home, path)
              if (!(await fs.exists(path))) await fs.mkdir(path, { recursive: true })
              const target = await desktopDrawer(path)
              workspace.current = target
              setAway(target)
              return path
            },
          } satisfies Tool,
        ]
      : []),
  ]

  useEffect(() => {
    remember('mode', mode)
  }, [mode])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const follow = () => setSystemDark(query.matches)
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  }, [])

  // The button names where it will take you, not where you are. Landing back on
  // whatever the system already shows hands the choice back to the system.
  const shown = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
  const flip = shown === 'dark' ? 'light' : 'dark'
  const flipTheme = () => setTheme(flip === (systemDark ? 'dark' : 'light') ? 'system' : flip)

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
    // The circle is told only once the page is really going, so a cancelled
    // "leave this page?" doesn't drop you out of the room.
    const gone = () => circleRef.current?.close()
    window.addEventListener('beforeunload', leave)
    window.addEventListener('pagehide', gone)
    return () => {
      window.removeEventListener('beforeunload', leave)
      window.removeEventListener('pagehide', gone)
    }
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
      else if (key === 'j') run(() => toggleSide('quill'))
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
    live: 'Shared live',
  }

  // Quill stays mounted once opened, so a Brief keeps writing while its panel is closed.
  const quillView =
    quillOpened ? (
      <Quill
        hidden={quiet || side !== 'quill'}
        take={() => sheet.current?.passage() ?? null}
        onLand={(from, answer, how) => {
          if (mode === 'read') setMode('split')
          sheet.current?.land(from, answer, how)
        }}
        onClose={() => setSide('none')}
        canFile={drawer.kind === 'browser' || drawer.kind === 'tauri'}
        onFile={fileInto}
        onOpenFolder={() => void openFolder()}
        onBusy={setQuillBusy}
        tools={tools}
        style={style}
        onClearStyle={() => setStyle(null)}
        away={away && away !== drawer ? { label: away.label, open: () => void shelve(away) } : null}
      />
    ) : null

  const sideView = quiet ? null : side === 'circle' ? (
    <CirclePanel
      circle={circle}
      hosting={hosting}
      me={me}
      busy={shareBusy}
      error={shareError}
      canStart={Boolean(current)}
      onStart={() => void startSharing()}
      onJoin={(invite) => void join(invite)}
      onLeave={stopSharing}
      onRename={rename}
      onClose={() => setSide('none')}
    />
  ) : null

  return (
    <div className={`desk mode-${mode}${quiet ? ' quiet' : ''}${shelfOpen ? ' shelf-open' : ''}`}>
      <div className="grip" data-tauri-drag-region aria-hidden="true" />
      {!quiet ? (
        <Shelf
          drawer={drawer}
          leaves={leaves}
          current={current?.path ?? null}
          canFolder={folderSupport() === 'folder'}
          outline={current ? <Lookout headings={inked.headings} active={active} onPick={pick} bare /> : null}
          onOpen={() => {
            setShelfOpen(false)
            void openFolder()
          }}
          onPick={(leaf) => {
            setShelfOpen(false)
            if (drawer.kind !== 'circle') void load(drawer, leaf)
          }}
          onCreate={(name) => void create(name)}
          recents={recents}
          onReopen={(recent) => {
            setShelfOpen(false)
            void reopen(recent)
          }}
          onPrompt={setCard}
          onScratch={() => {
            setShelfOpen(false)
            void shelve(scratchDrawer())
          }}
        />
      ) : null}
      {shelfOpen ? <button type="button" className="scrim" aria-label="Close files" onClick={() => setShelfOpen(false)} /> : null}

      <main className="work">
        <div className="panes">
          {current ? (
            <>
              <section className="pane pane-sheet" aria-label="Editor" hidden={mode === 'read'}>
                <Sheet ref={sheet} docKey={docKey} text={text} shared={shared} onChange={change} onCursor={followCursor} onScrollLine={followSheetScroll} />
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
          <button type="button" className="quiet-button text bar-files" aria-pressed={shelfOpen} onClick={() => setShelfOpen((o) => !o)}>
            files
          </button>
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
            <button type="button" className="quiet-button text" aria-pressed={side === 'quill'} onClick={() => toggleSide('quill')} title="Quill (Mod+J)">
              {quillBusy ? `quill ${quillBusy}` : 'quill'}
            </button>
            <button type="button" className={`quiet-button text${circle ? ' is-sharing' : ''}`} aria-pressed={side === 'circle'} onClick={() => toggleSide('circle')} title="Share">
              share
            </button>
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
            <button type="button" className="quiet-button text" onClick={flipTheme} title={`Switch to ${flip} theme`}>
              {flip}
            </button>
            <button type="button" className="quiet-button text bar-quiet" aria-pressed={quiet} onClick={() => setQuiet((q) => !q)} title="Quiet mode (Mod+.)">
              quiet
            </button>
          </div>
        </footer>
      </main>

      {quillView}
      {sideView}
      {card ? (
        <PromptCard
          prompt={card}
          onClose={() => setCard(null)}
          onUse={(chosen) => {
            setStyle(chosen)
            setCard(null)
            setQuillOpened(true)
            setSide('quill')
          }}
        />
      ) : null}
    </div>
  )
}
