import './dictation.css'
import { useEffect, useRef, useState } from 'react'
import { listen, type Voice, voices } from './dictate'
import { recall, remember } from './keep'

const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
const ids = voices.map((v) => v.id) as Voice[]

export function MicButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const keys = mac ? '⌘⇧D' : 'Ctrl Shift D'
  return (
    <button type="button" className={`mic-button${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onToggle} title={`Dictate (${keys})`} aria-label="Dictate">
      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" />
        <path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2" />
      </svg>
    </button>
  )
}

// A small pill over the page while the microphone is open: what is being
// heard right now, which language it listens for, and a way to stop.
export function Listening({ fallback, onHeard, onStop }: { fallback: Voice; onHeard: (text: string) => void; onStop: () => void }) {
  const [voice, setVoice] = useState<Voice>(() => recall('dictate-voice', fallback, ids))
  const [draft, setDraft] = useState('')
  const [trouble, setTrouble] = useState<'blocked' | 'unavailable' | null>(null)
  const heard = useRef(onHeard)
  heard.current = onHeard

  useEffect(() => {
    setTrouble(null)
    return listen(voice, {
      onHeard: (text) => heard.current(text),
      onDraft: setDraft,
      onStop: (reason) => {
        if (reason !== 'done') setTrouble(reason)
      },
    })
  }, [voice])

  const pick = (next: Voice) => {
    remember('dictate-voice', next)
    setVoice(next)
  }

  return (
    <div className={`listening${trouble ? ' has-trouble' : ''}`} role="status" aria-live="polite">
      <span className="listening-dot" aria-hidden="true" />
      <span className="listening-text">
        {trouble === 'blocked' ? 'Microphone is blocked' : trouble === 'unavailable' ? 'Dictation is not available here' : (draft.length > 80 ? `…${draft.slice(-80)}` : draft) || 'Listening'}
      </span>
      <label className="listening-voice">
        <span className="sr-only">Dictation language</span>
        <select value={voice} onChange={(e) => pick(e.target.value as Voice)}>
          {voices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="listening-stop" onClick={onStop}>
        Stop
      </button>
    </div>
  )
}
