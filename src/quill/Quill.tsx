import './quill.css'
import { useEffect, useRef, useState } from 'react'
import { onDesktop } from '../drawer/tauri'
import { recallShape, rememberShape } from '../keep'
import { type AskId, asks, type Landing, nothing, type Passage, question, system } from './asks'
import { Brief } from './Brief'
import { keepKey, readKey, remembers, takeOldKeys } from './vault'
import { converse, listModels, speak, type Tool, type Tuning, type Turn, type VoiceId, voiceOf, voices } from './voices'

type Props = {
  take: () => Passage | null
  onLand: (from: Passage, answer: string, how: Landing) => void
  onClose: () => void
  canFile: boolean
  onFile: (name: string, text: string) => Promise<string>
  onOpenFolder: () => void
  onBusy: (label: string | null) => void
  tools: Tool[]
  away: { label: string; open: () => void } | null
  hidden?: boolean
}

type Reply = {
  from: Passage
  how: Landing
  label: string
  text: string
  done: boolean
  error?: string
  log: { line: string; failed: boolean }[]
}

// What a tool call did, in a few words, for the activity list under an answer.
const describe = (name: string, input: Record<string, unknown>, result: string, failed: boolean) => {
  if (failed) return result
  const said = (key: string) => (typeof input[key] === 'string' ? (input[key] as string) : '')
  if (name === 'create_file') return `Created ${result}`
  if (name === 'edit_draft') return said('mode') === 'append' ? 'Added to the draft' : 'Replaced the draft'
  if (name === 'use_folder') return `Using ${result}`
  if (name === 'read_file') return `Read ${said('path')}`
  if (name === 'list_files') return 'Looked at the folder'
  return name
}

// Settings are plain preferences. The key is not one of them; it lives in the vault.
type Settings = Omit<Tuning, 'key'>

const untuned: Settings = { voice: 'anthropic', base: voiceOf('anthropic').base, model: '' }

const recallSettings = (): Settings => {
  const stored = recallShape<Settings & Record<string, unknown>>('quill', { ...untuned })
  for (const [voice, key] of Object.entries(takeOldKeys(stored))) if (key) void keepKey(voice as VoiceId, key, false)
  return { voice: stored.voice, base: stored.base, model: stored.model }
}

export function Quill({ take, onLand, onClose, canFile, onFile, onOpenFolder, onBusy, tools, away, hidden }: Props) {
  const [settings, setSettings] = useState<Settings>(recallSettings)
  const [key, setKey] = useState('')
  const [keyFor, setKeyFor] = useState<VoiceId | null>(null)
  const [remember, setRemember] = useState(() => remembers(settings.voice))
  const [tuning, setTuning] = useState(!settings.model)
  const [models, setModels] = useState<string[]>([])
  const [listing, setListing] = useState<'idle' | 'busy' | 'failed'>('idle')
  const [listError, setListError] = useState('')
  const [reply, setReply] = useState<Reply | null>(null)
  const [words, setWords] = useState('')
  const [view, setView] = useState<'ask' | 'brief'>('ask')
  // Free questions are a conversation. Only the words go into the history; the
  // draft travels with the newest question alone, so a long chat stays cheap.
  const [thread, setThread] = useState<Turn[]>([])
  const stop = useRef<AbortController | null>(null)
  const voice = voiceOf(settings.voice)
  const kept: Tuning = { ...settings, key }

  useEffect(() => rememberShape('quill', settings), [settings])
  useEffect(() => () => stop.current?.abort(), [])

  // Each provider has its own key. Nothing is written back until the stored one
  // has been read, so opening the panel can never wipe a saved key.
  useEffect(() => {
    let live = true
    setKeyFor(null)
    setRemember(remembers(settings.voice))
    void readKey(settings.voice)
      .catch(() => '')
      .then((found) => {
        if (!live) return
        setKey(found)
        setKeyFor(settings.voice)
      })
    return () => {
      live = false
    }
  }, [settings.voice])

  useEffect(() => {
    if (keyFor !== settings.voice) return
    const later = window.setTimeout(() => void keepKey(keyFor, key.trim(), remember).catch(() => {}), 400)
    return () => window.clearTimeout(later)
  }, [key, remember, keyFor, settings.voice])

  const ready = Boolean(kept.model && kept.base && (!voice.keyed || kept.key))

  const pickVoice = (id: VoiceId) => {
    setModels([])
    setListing('idle')
    setKey('')
    setSettings((k) => ({ ...k, voice: id, base: voiceOf(id).base, model: '' }))
  }

  const fetchModels = async () => {
    setListing('busy')
    setListError('')
    try {
      const found = await listModels(kept)
      setModels(found)
      setListing('idle')
      if (!found.includes(kept.model)) setSettings((k) => ({ ...k, model: found[0] ?? '' }))
    } catch (error) {
      setListing('failed')
      setListError(error instanceof Error ? error.message : String(error))
    }
  }

  const run = async (from: Passage, how: Reply['how'], label: string, turns: Turn[]) => {
    stop.current?.abort()
    const control = new AbortController()
    stop.current = control
    setReply({ from, how, label, text: '', done: false, log: [] })
    let text = ''
    try {
      for await (const piece of speak(kept, system, turns, control.signal)) {
        text += piece
        setReply((r) => (r && !control.signal.aborted ? { ...r, text: r.text + piece } : r))
      }
      setReply((r) => (r ? { ...r, done: true } : r))
      return text
    } catch (error) {
      if (control.signal.aborted) return null
      setReply((r) => (r ? { ...r, done: true, error: error instanceof Error ? error.message : String(error) } : r))
      return null
    }
  }

  const ask = (id: AskId) => {
    const from = take()
    const chosen = asks.find((a) => a.id === id)
    if (!from || !chosen) return
    if (id !== 'continue' && !from.text) return
    void run(from, chosen.lands, chosen.label, chosen.turns(from))
  }

  // Free questions may use tools: write files, change the draft, pick a folder.
  const send = async (event: React.FormEvent) => {
    event.preventDefault()
    const from = take() ?? nothing
    const said = words.trim()
    if (!said) return
    setWords('')
    stop.current?.abort()
    const control = new AbortController()
    stop.current = control
    setReply({ from, how: 'after', label: said, text: '', done: false, log: [] })
    onBusy('…')
    try {
      const answer = await converse(kept, system, [...thread, ...question(from, said)], tools, control.signal, (e) => {
        if (control.signal.aborted) return
        if (e.kind === 'text') setReply((r) => (r ? { ...r, text: r.text + e.text } : r))
        else setReply((r) => (r ? { ...r, text: r.text ? `${r.text.trimEnd()}\n\n` : '', log: [...r.log, { line: describe(e.name, e.input, e.result, e.failed), failed: e.failed }] } : r))
      })
      setReply((r) => (r ? { ...r, done: true } : r))
      setThread((t) => [...t, { role: 'user' as const, content: said }, { role: 'assistant' as const, content: answer || 'Done.' }].slice(-16))
    } catch (error) {
      if (!control.signal.aborted) setReply((r) => (r ? { ...r, done: true, error: error instanceof Error ? error.message : String(error) } : r))
    } finally {
      onBusy(null)
    }
  }

  const halt = () => {
    stop.current?.abort()
    setReply((r) => (r ? { ...r, done: true } : r))
  }

  const settle = (how: Landing = reply?.how ?? 'after') => {
    if (!reply?.text.trim()) return
    onLand(reply.from, reply.text, how)
    setReply(null)
  }

  return (
    <aside className="quill" aria-label="Quill" hidden={hidden}>
      <div className="quill-head">
        <span className="quill-title">Quill</span>
        {ready ? (
          <button type="button" className="quiet-button text" onClick={() => setTuning((t) => !t)} aria-pressed={tuning}>
            {tuning ? 'Done' : kept.model}
          </button>
        ) : null}
        <button type="button" className="quiet-button" onClick={onClose} aria-label="Close Quill" title="Close (Mod+J)">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      {tuning ? (
        <form
          className="quill-tune"
          onSubmit={(e) => {
            e.preventDefault()
            if (ready) setTuning(false)
            else void fetchModels()
          }}
        >
          <label>
            <span>Provider</span>
            <select value={kept.voice} onChange={(e) => pickVoice(e.target.value as VoiceId)}>
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          {voice.id === 'custom' || voice.id === 'ollama' ? (
            <label>
              <span>Endpoint</span>
              <input value={kept.base} onChange={(e) => setSettings((k) => ({ ...k, base: e.target.value }))} spellCheck={false} autoComplete="off" />
            </label>
          ) : null}
          {voice.keyed ? (
            <label>
              <span>API key</span>
              <input type="password" value={key} onChange={(e) => setKey(e.target.value)} spellCheck={false} autoComplete="off" />
            </label>
          ) : null}
          {voice.keyed && !onDesktop() ? (
            <label className="quill-remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Remember on this device</span>
            </label>
          ) : null}
          <label>
            <span>Model</span>
            <div className="quill-row">
              {models.length ? (
                <select value={kept.model} onChange={(e) => setSettings((k) => ({ ...k, model: e.target.value }))}>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={kept.model} onChange={(e) => setSettings((k) => ({ ...k, model: e.target.value }))} spellCheck={false} autoComplete="off" />
              )}
              <button type="button" className="line-button" onClick={() => void fetchModels()} disabled={listing === 'busy' || (voice.keyed && !kept.key)}>
                {listing === 'busy' ? 'Loading' : 'Load'}
              </button>
            </div>
          </label>
          {listing === 'failed' ? <p className="quill-error">{listError}</p> : null}
          <button type="submit" className="line-button solid" disabled={!ready}>
            Start writing
          </button>
        </form>
      ) : (
        <div className="quill-work">
          <div className="quill-asks">
            {asks.map((a) => (
              <button key={a.id} type="button" onClick={() => ask(a.id)} disabled={Boolean(reply && !reply.done) || view === 'brief'}>
                {a.label}
              </button>
            ))}
            <button type="button" className="quill-brief-tab" aria-pressed={view === 'brief'} onClick={() => setView((v) => (v === 'brief' ? 'ask' : 'brief'))}>
              Brief
            </button>
          </div>

          <div className="quill-pane" hidden={view !== 'brief'}>
            <Brief tuning={kept} canFile={canFile} onFile={onFile} onOpenFolder={onOpenFolder} onBusy={onBusy} onBack={() => setView('ask')} />
          </div>

          <div className="quill-pane" hidden={view !== 'ask'}>

          <div className="quill-reply" aria-live="polite">
            {reply ? (
              <>
                <p className="quill-label">{reply.label}</p>
                {reply.log.length ? (
                  <ul className="quill-log">
                    {reply.log.map((entry, i) => (
                      <li key={i} className={entry.failed ? 'is-failed' : undefined}>
                        {entry.line}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {reply.text ? <div className="quill-text">{reply.text.trim()}</div> : null}
                {reply.done && away ? (
                  <button type="button" className="line-button quill-away" onClick={away.open}>
                    Open {away.label}
                  </button>
                ) : null}
                {!reply.done ? <span className="quill-pulse" aria-label="Writing" /> : null}
                {reply.error ? <p className="quill-error">{reply.error}</p> : null}
              </>
            ) : null}
          </div>

          {reply ? (
            <div className="quill-act">
              {reply.done ? (
                <>
                  <button type="button" className="line-button solid" onClick={() => settle()} disabled={!reply.text.trim()}>
                    {reply.how === 'replace' && reply.from.text ? 'Replace' : 'Insert'}
                  </button>
                  {reply.how === 'after' ? (
                    <button type="button" className="quiet-button text" onClick={() => settle('all')} disabled={!reply.text.trim()}>
                      Replace all
                    </button>
                  ) : null}
                  <button type="button" className="quiet-button text" onClick={() => void navigator.clipboard.writeText(reply.text)} disabled={!reply.text}>
                    Copy
                  </button>
                  <button type="button" className="quiet-button text" onClick={() => setReply(null)}>
                    Discard
                  </button>
                </>
              ) : (
                <button type="button" className="quiet-button text" onClick={halt}>
                  Stop
                </button>
              )}
            </div>
          ) : null}

          <form className="quill-ask" onSubmit={(e) => void send(e)}>
            <textarea
              value={words}
              onChange={(e) => setWords(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) void send(e)
              }}
              rows={2}
              aria-label="Ask Quill"
            />
          </form>
          </div>
        </div>
      )}
    </aside>
  )
}
