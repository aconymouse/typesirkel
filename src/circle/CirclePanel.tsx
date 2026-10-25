import '../muse/muse.css'
import './circle.css'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { type Circle, type Person, readInvite } from './circle'

type Props = {
  circle: Circle | null
  hosting: boolean
  me: Person
  busy: boolean
  error: string
  canStart: boolean
  onStart: () => void
  onJoin: (invite: { room: string; secret: string }) => void
  onLeave: () => void
  onRename: (me: Person) => void
  onClose: () => void
}

const statusLabel = { connecting: 'Connecting', live: 'Live', offline: 'Reconnecting', full: 'Room is full' }

const useCircle = (circle: Circle | null) =>
  useSyncExternalStore(
    (fn) => (circle ? circle.watch(fn) : () => {}),
    () => (circle ? `${circle.status}|${circle.peers.map((p) => `${p.id}:${p.name}:${p.color}`).join(',')}` : ''),
  )

export function CirclePanel({ circle, hosting, me, busy, error, canStart, onStart, onJoin, onLeave, onRename, onClose }: Props) {
  useCircle(circle)
  const [name, setName] = useState(me.name)
  const [pasted, setPasted] = useState('')
  const [copied, setCopied] = useState(false)
  const invite = readInvite(pasted)

  useEffect(() => setName(me.name), [me.name])

  const copy = async () => {
    if (!circle) return
    await navigator.clipboard.writeText(circle.link)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const commitName = () => {
    const clean = name.trim().slice(0, 32)
    if (clean && clean !== me.name) onRename({ ...me, name: clean })
    else setName(me.name)
  }

  return (
    <aside className="circle" aria-label="Share">
      <div className="circle-head">
        <span className="circle-title">Share</span>
        {circle ? <span className={`circle-status is-${circle.status}`}>{statusLabel[circle.status]}</span> : null}
        <button type="button" className="quiet-button" onClick={onClose} aria-label="Close share">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      <div className="circle-body">
        {circle ? (
          <>
            <div className="circle-field">
              <span>Link</span>
              <div className="muse-row">
                <input readOnly value={circle.link} onFocus={(e) => e.currentTarget.select()} aria-label="Share link" />
                <button type="button" className="line-button" onClick={() => void copy()}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="circle-field">
              <span>In the room</span>
              <ul className="circle-people">
                {circle.peers.map((p) => (
                  <li key={p.id}>
                    <i style={{ background: p.color }} />
                    {p.name}
                    {p.me ? <em>you</em> : null}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <p className="circle-lead">Write together, live. Anyone with the link can read and edit this draft with you.</p>
            <button type="button" className="line-button solid" onClick={onStart} disabled={busy || !canStart}>
              {busy ? 'Opening' : 'Start sharing'}
            </button>
            <form
              className="circle-field"
              onSubmit={(e) => {
                e.preventDefault()
                if (invite) onJoin(invite)
              }}
            >
              <span>Join a draft</span>
              <div className="muse-row">
                <input value={pasted} onChange={(e) => setPasted(e.target.value)} spellCheck={false} autoComplete="off" aria-label="Share link to join" />
                <button type="submit" className="line-button" disabled={busy || !invite}>
                  Join
                </button>
              </div>
            </form>
          </>
        )}

        <label className="circle-field">
          <span>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={commitName} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} maxLength={32} />
        </label>

        {error ? <p className="muse-error">{error}</p> : null}

        {circle ? (
          <button type="button" className="line-button" onClick={onLeave}>
            {hosting ? 'Stop sharing' : 'Leave'}
          </button>
        ) : null}

        <p className="circle-fine">The key lives only in the link, after the #. The relay passes along sealed bytes and never sees your words.</p>
      </div>
    </aside>
  )
}
