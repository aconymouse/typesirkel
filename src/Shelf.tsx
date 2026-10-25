import { type ReactNode, useState } from 'react'
import type { Drawer, Leaf } from './drawer'
import { recall, remember } from './keep'

type Props = {
  drawer: Drawer
  leaves: Leaf[]
  current: string | null
  canFolder: boolean
  outline: ReactNode
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

export function Shelf({ drawer, leaves, current, canFolder, outline, onOpen, onPick, onCreate, onScratch }: Props) {
  const [naming, setNaming] = useState(false)
  const [name, setName] = useState('')
  const [filesOpen, toggleFiles] = useFold('shelf-files')
  const [outlineOpen, toggleOutline] = useFold('shelf-outline')
  const writable = drawer.kind === 'browser' || drawer.kind === 'tauri'

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (name.trim()) onCreate(name)
    setName('')
    setNaming(false)
  }

  return (
    <nav className={`shelf${filesOpen ? '' : ' files-shut'}${outline && outlineOpen ? ' outline-open' : ''}`} aria-label="Files">
      <div className="shelf-head">
        <button type="button" className="shelf-toggle" onClick={toggleFiles} aria-expanded={filesOpen} title={drawer.label}>
          <Fold open={filesOpen} />
          <span className="shelf-label">{drawer.label}</span>
        </button>
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
        <section className="shelf-outline">
          <button type="button" className="shelf-toggle shelf-rule" onClick={toggleOutline} aria-expanded={outlineOpen}>
            <Fold open={outlineOpen} />
            <span>On this page</span>
          </button>
          {outlineOpen ? <div className="shelf-outline-body">{outline}</div> : null}
        </section>
      ) : null}

      <div className="shelf-foot">
        <button type="button" className="line-button" onClick={onOpen}>
          {canFolder ? 'Open folder' : 'Open file'}
        </button>
        {drawer.kind !== 'scratch' ? (
          <button type="button" className="quiet-button text" onClick={onScratch}>
            Scratch
          </button>
        ) : null}
      </div>
    </nav>
  )
}
