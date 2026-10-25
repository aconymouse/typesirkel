import { type ReactNode, useEffect, useRef, useState } from 'react'
import type { Drawer, Leaf } from './drawer'
import type { Recent } from './drawer/recent'
import { recall, remember } from './keep'
import { langs, type Lang, useLang } from './lang'
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
}

const groupByDir = (leaves: Leaf[]) => {
  const groups = new Map<string, Leaf[]>()
  for (const leaf of leaves) groups.set(leaf.dir, [...(groups.get(leaf.dir) ?? []), leaf])
  return [...groups.entries()].sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)))
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

function Fold({ open }: { open: boolean }) {
  return (
    <svg className={open ? 'fold open' : 'fold'} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M3 2l3 3-3 3" />
    </svg>
  )
}

export function Shelf({ drawer, leaves, current, canFolder, outline, recents, onReopen, onPrompt, onOpen, onPick, onCreate, onScratch }: Props) {
  const [naming, setNaming] = useState(false)
  const [name, setName] = useState('')
  const [filesOpen, toggleFiles] = useFold('shelf-files')
  const [outlineOpen, toggleOutline] = useFold('shelf-outline')
  const [promptsOpen, togglePrompts] = useFold('shelf-prompts')
  const [menu, setMenu] = useState(false)
  const head = useRef<HTMLDivElement>(null)
  const writable = drawer.kind === 'browser' || drawer.kind === 'tauri' || drawer.kind === 'scratch'
  const [lang, setLang] = useLang()
  const groups = byCategory(lang)

  useEffect(() => {
    if (!menu) return
    const away = (event: PointerEvent) => !head.current?.contains(event.target as Node) && setMenu(false)
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

  return (
    <nav className={`shelf${filesOpen ? '' : ' files-shut'}${(outline && outlineOpen) || promptsOpen ? ' lower-open' : ''}`} aria-label="Files">
      <div className="shelf-head" ref={head}>
        <button type="button" className="shelf-fold" onClick={toggleFiles} aria-expanded={filesOpen} aria-label={filesOpen ? 'Fold files' : 'Unfold files'}>
          <Fold open={filesOpen} />
        </button>
        <button type="button" className="shelf-switch" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-haspopup="menu" title={drawer.label}>
          <span className="shelf-label">{drawer.label}</span>
          <svg className="shelf-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M2.5 4l2.5 2.5L7.5 4" />
          </svg>
        </button>
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
            <button
              type="button"
              role="menuitem"
              className={drawer.kind === 'scratch' ? 'here' : undefined}
              onClick={() => {
                setMenu(false)
                onScratch()
              }}
            >
              Scratch
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenu(false)
                onOpen()
              }}
            >
              {canFolder ? 'Open folder…' : 'Open file…'}
            </button>
          </div>
        ) : null}
        {writable ? (
          <button
            type="button"
            className="quiet-button"
            onClick={() => {
              if (!filesOpen) toggleFiles()
              setNaming(true)
            }}
            aria-label="New file"
            title="New file"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 2v10M2 7h10" />
            </svg>
          </button>
        ) : null}
      </div>

      {filesOpen ? (
        <div className="shelf-list">
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

      {outline ? (
        <section className={`shelf-outline${outlineOpen ? ' is-open' : ''}`}>
          <button type="button" className="shelf-toggle shelf-rule" onClick={toggleOutline} aria-expanded={outlineOpen}>
            <Fold open={outlineOpen} />
            <span>On this page</span>
          </button>
          {outlineOpen ? <div className="shelf-outline-body">{outline}</div> : null}
        </section>
      ) : null}

      <section className={`shelf-outline shelf-prompts${promptsOpen ? ' is-open' : ''}`}>
        <div className="shelf-rule shelf-prompts-head">
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
            <b aria-hidden="true">{lang === 'pt-BR' ? 'PT' : lang.toUpperCase()}</b>
          </label>
        </div>
        {promptsOpen ? (
          <div className="shelf-outline-body">
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

      <div className="shelf-foot">
        <button type="button" className="line-button" onClick={onOpen}>
          {canFolder ? 'Open folder' : 'Open file'}
        </button>
      </div>
    </nav>
  )
}
