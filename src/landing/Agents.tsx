import { useEffect, useState } from 'react'
import { clients } from './clients'

type Scene = {
  client: string
  prompt: string
  calls: string[]
  touched: { path: string; how: 'new' | 'edited' }
  shelf: string[]
}

// Three ordinary jobs, played one after another. They show what the MCP server
// is for better than a feature list could: the agent works in your folder, and
// you keep writing in the same files.
const scenes: Scene[] = [
  {
    client: 'Claude Desktop',
    prompt: "Turn this week's meeting notes into one summary.",
    calls: ['search_notes "meeting"', 'read_note meetings/monday.md', 'read_note meetings/thursday.md', 'write_note weekly/week-43.md'],
    touched: { path: 'weekly/week-43.md', how: 'new' },
    shelf: ['drafts/essay.md', 'meetings/monday.md', 'meetings/thursday.md', 'weekly/week-43.md'],
  },
  {
    client: 'Claude Code',
    prompt: 'Add what I shipped today to the changelog.',
    calls: ['read_note changelog.md', 'append_to_note changelog.md'],
    touched: { path: 'changelog.md', how: 'edited' },
    shelf: ['changelog.md', 'drafts/essay.md', 'meetings/monday.md', 'weekly/week-43.md'],
  },
  {
    client: 'Cursor',
    prompt: 'Find everything I wrote about Lisbon and outline a guide.',
    calls: ['search_notes "Lisbon"', 'outline_note travel/trip.md', 'write_note guides/lisbon.md'],
    touched: { path: 'guides/lisbon.md', how: 'new' },
    shelf: ['changelog.md', 'guides/lisbon.md', 'travel/trip.md', 'weekly/week-43.md'],
  },
]

const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Agents() {
  const [scene, setScene] = useState(0)
  const [typed, setTyped] = useState(0)
  const [shown, setShown] = useState(0)
  const now = scenes[scene]
  const done = shown >= now.calls.length

  useEffect(() => {
    if (still()) {
      setTyped(now.prompt.length)
      setShown(now.calls.length)
      const next = window.setTimeout(() => setScene((s) => (s + 1) % scenes.length), 6000)
      return () => window.clearTimeout(next)
    }
    setTyped(0)
    setShown(0)
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    const typing = 28
    for (let i = 1; i <= now.prompt.length; i++) at(i * typing, () => setTyped(i))
    const start = now.prompt.length * typing + 450
    now.calls.forEach((_, i) => at(start + i * 650, () => setShown(i + 1)))
    at(start + now.calls.length * 650 + 3200, () => setScene((s) => (s + 1) % scenes.length))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [scene, now])

  return (
    <section className="agents" aria-labelledby="agents-title">
      <div className="agents-copy">
        <p className="kicker">MCP</p>
        <h2 id="agents-title">Let your AI work in your folder.</h2>
        <p>typeSirkel ships a small MCP server. Point Claude, Cursor or any other MCP client at your notes folder and it can search, read, outline and write markdown there, while you keep writing in the same files.</p>
        <p>Ask it to summarize a week of meetings, keep a changelog, or pull scattered notes into one outline. The desktop app picks up its edits as they land, so you never copy and paste between windows.</p>
        <pre className="agents-config">
          <code>{`npx -y typesirkel-mcp ~/Notes`}</code>
        </pre>
      </div>

      <div className="agents-stage" aria-hidden="true">
        <div className="agents-chat">
          <p className="agents-client">{now.client}</p>
          <p className="agents-prompt">
            {now.prompt.slice(0, typed)}
            {typed < now.prompt.length ? <span className="agents-caret" /> : null}
          </p>
          <ul className="agents-calls">
            {now.calls.slice(0, shown).map((call) => (
              <li key={call}>
                <span>typesirkel</span> {call}
              </li>
            ))}
          </ul>
          {done ? <p className="agents-done">Done. {now.touched.how === 'new' ? 'Created' : 'Updated'} {now.touched.path}</p> : null}
        </div>
        <div className="agents-shelf">
          <p className="agents-folder">Notes</p>
          <ul>
            {now.shelf.map((path) => {
              const hit = done && path === now.touched.path
              const hidden = !done && now.touched.how === 'new' && path === now.touched.path
              return hidden ? null : (
                <li key={path} className={hit ? 'is-touched' : undefined}>
                  {path}
                  {hit ? <em>{now.touched.how}</em> : null}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="agents-clients">
        <p className="agents-label">Works with any MCP client</p>
        <ul>
          {clients.map((c) => (
            <li key={c.name} title={c.name}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d={c.path} />
              </svg>
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
