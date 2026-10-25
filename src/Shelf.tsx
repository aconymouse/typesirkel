import { useState } from 'react'
import type { Drawer, Leaf } from './drawer'

type Props = {
  drawer: Drawer
  leaves: Leaf[]
  current: string | null
  canFolder: boolean
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

export function Shelf({ drawer, leaves, current, canFolder, onOpen, onPick, onCreate, onScratch }: Props) {
  const [naming, setNaming] = useState(false)
  const [name, setName] = useState('')
  const writable = drawer.kind === 'browser' || drawer.kind === 'tauri'

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (name.trim()) onCreate(name)
    setName('')
    setNaming(false)
  }

  return (
    <nav className="shelf" aria-label="Files">
      <div className="shelf-head">
        <span className="shelf-label" title={drawer.label}>
          {drawer.label}
        </span>
        {writable ? (
          <button type="button" className="quiet-button" onClick={() => setNaming(true)} aria-label="New file" title="New file">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 2v10M2 7h10" />
            </svg>
          </button>
        ) : null}
      </div>
      {naming ? (
        <form onSubmit={submit} className="shelf-new">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={() => !name && setNaming(false)} onKeyDown={(e) => e.key === 'Escape' && setNaming(false)} placeholder="name.md" aria-label="File name" />
        </form>
      ) : null}
      <div className="shelf-list">
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
        {leaves.length === 0 ? <p className="shelf-empty">No markdown files here yet.</p> : null}
      </div>
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
