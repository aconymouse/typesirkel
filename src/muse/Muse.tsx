import './muse.css'
import { useEffect, useRef, useState } from 'react'
import { recallShape, rememberShape } from '../keep'
import { type AskId, asks, type Passage, question, system } from './asks'
import { listModels, speak, type Tuning, type Turn, type VoiceId, voiceOf, voices } from './voices'

type Props = {
  take: () => Passage | null
  onLand: (from: Passage, answer: string, how: 'replace' | 'after') => void
  onClose: () => void
}

type Reply = {
  from: Passage
  how: 'replace' | 'after'
  label: string
  text: string
  done: boolean
  error?: string
}

const untuned: Tuning = { voice: 'anthropic', base: voiceOf('anthropic').base, key: '', model: '' }

// Keys are kept per provider, so switching to try another one doesn't wipe the first.
type Kept = Tuning & { keys: Partial<Record<VoiceId, string>> }

export function Muse({ take, onLand, onClose }: Props) {
  const [kept, setKept] = useState<Kept>(() => recallShape('muse', { ...untuned, keys: {} }))
  const [tuning, setTuning] = useState(!kept.model)
  const [models, setModels] = useState<string[]>([])
  const [listing, setListing] = useState<'idle' | 'busy' | 'failed'>('idle')
  const [listError, setListError] = useState('')
  const [reply, setReply] = useState<Reply | null>(null)
  const [words, setWords] = useState('')
  const stop = useRef<AbortController | null>(null)
  const voice = voiceOf(kept.voice)

  useEffect(() => rememberShape('muse', kept), [kept])
  useEffect(() => () => stop.current?.abort(), [])

  const ready = Boolean(kept.model && kept.base && (!voice.keyed || kept.key))

  const pickVoice = (id: VoiceId) => {
    const next = voiceOf(id)
    setModels([])
    setListing('idle')
    setKept((k) => ({ ...k, keys: { ...k.keys, [k.voice]: k.key }, voice: id, base: next.base, key: k.keys[id] ?? '', model: '' }))
  }

  const fetchModels = async () => {
    setListing('busy')
    setListError('')
    try {
      const found = await listModels(kept)
      setModels(found)
      setListing('idle')
      if (!found.includes(kept.model)) setKept((k) => ({ ...k, model: found[0] ?? '' }))
    } catch (error) {
      setListing('failed')
      setListError(error instanceof Error ? error.message : String(error))
    }
  }

  const run = async (from: Passage, how: Reply['how'], label: string, turns: Turn[]) => {
    stop.current?.abort()
    const control = new AbortController()
    stop.current = control
    setReply({ from, how, label, text: '', done: false })
    try {
      for await (const piece of speak(kept, system, turns, control.signal)) {
        setReply((r) => (r && !control.signal.aborted ? { ...r, text: r.text + piece } : r))
      }
      setReply((r) => (r ? { ...r, done: true } : r))
    } catch (error) {
      if (control.signal.aborted) return
      setReply((r) => (r ? { ...r, done: true, error: error instanceof Error ? error.message : String(error) } : r))
    }
  }

  const ask = (id: AskId) => {
    const from = take()
    const chosen = asks.find((a) => a.id === id)
    if (!from || !chosen) return
    if (id !== 'continue' && !from.text) return
    void run(from, chosen.lands, chosen.label, chosen.turns(from))
  }

  const send = (event: React.FormEvent) => {
    event.preventDefault()
    const from = take()
    if (!from || !words.trim()) return
    void run(from, 'after', words.trim(), question(from, words.trim()))
    setWords('')
  }

  const halt = () => {
    stop.current?.abort()
    setReply((r) => (r ? { ...r, done: true } : r))
  }

  const settle = () => {
    if (!reply?.text.trim()) return
    onLand(reply.from, reply.text, reply.how)
    setReply(null)
  }

  return (
    <aside className="muse" aria-label="Muse">
      <div className="muse-head">
        <span className="muse-title">Muse</span>
        {ready ? (
          <button type="button" className="quiet-button text" onClick={() => setTuning((t) => !t)} aria-pressed={tuning}>
            {tuning ? 'Done' : kept.model}
          </button>
        ) : null}
        <button type="button" className="quiet-button" onClick={onClose} aria-label="Close muse" title="Close (Mod+J)">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      {tuning ? (
        <form
          className="muse-tune"
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
              <input value={kept.base} onChange={(e) => setKept((k) => ({ ...k, base: e.target.value }))} spellCheck={false} autoComplete="off" />
            </label>
          ) : null}
          {voice.keyed ? (
            <label>
              <span>API key</span>
              <input type="password" value={kept.key} onChange={(e) => setKept((k) => ({ ...k, key: e.target.value }))} spellCheck={false} autoComplete="off" />
            </label>
          ) : null}
          <label>
            <span>Model</span>
            <div className="muse-row">
              {models.length ? (
                <select value={kept.model} onChange={(e) => setKept((k) => ({ ...k, model: e.target.value }))}>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={kept.model} onChange={(e) => setKept((k) => ({ ...k, model: e.target.value }))} spellCheck={false} autoComplete="off" />
              )}
              <button type="button" className="line-button" onClick={() => void fetchModels()} disabled={listing === 'busy' || (voice.keyed && !kept.key)}>
                {listing === 'busy' ? 'Loading' : 'Load'}
              </button>
            </div>
          </label>
          {listing === 'failed' ? <p className="muse-error">{listError}</p> : null}
          <button type="submit" className="line-button solid" disabled={!ready}>
            Start writing
          </button>
          <p className="muse-fine">Your key stays on this device and goes straight to {voice.label}. typeSirkel has no server in between.</p>
        </form>
      ) : (
        <div className="muse-work">
          <div className="muse-asks">
            {asks.map((a) => (
              <button key={a.id} type="button" onClick={() => ask(a.id)} disabled={Boolean(reply && !reply.done)}>
                {a.label}
              </button>
            ))}
          </div>

          <div className="muse-reply" aria-live="polite">
            {reply ? (
              <>
                <p className="muse-label">{reply.label}</p>
                {reply.text ? <div className="muse-text">{reply.text}</div> : null}
                {!reply.done ? <span className="muse-pulse" aria-label="Writing" /> : null}
                {reply.error ? <p className="muse-error">{reply.error}</p> : null}
              </>
            ) : (
              <p className="muse-idle">Select a passage, or put the cursor in a paragraph, then pick what to do with it.</p>
            )}
          </div>

          {reply ? (
            <div className="muse-act">
              {reply.done ? (
                <>
                  <button type="button" className="line-button solid" onClick={settle} disabled={!reply.text.trim()}>
                    {reply.how === 'replace' && reply.from.text ? 'Replace' : 'Insert'}
                  </button>
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

          <form className="muse-ask" onSubmit={send}>
            <textarea
              value={words}
              onChange={(e) => setWords(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) send(e)
              }}
              rows={2}
              placeholder="Ask about this draft"
              aria-label="Ask the muse"
            />
          </form>
        </div>
      )}
    </aside>
  )
}
