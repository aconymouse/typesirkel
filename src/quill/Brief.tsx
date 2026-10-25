import { useEffect, useRef, useState } from 'react'
import { type Piece, pieceTurns, planTurns, readPlan } from './plan'
import { speak, type Tuning } from './voices'

type Props = {
  tuning: Tuning
  system: string
  canFile: boolean
  onFile: (name: string, text: string) => Promise<string>
  onOpenFolder: () => void
  onBusy: (label: string | null) => void
  onBack: () => void
}

type Step = 'brief' | 'planning' | 'plan' | 'writing' | 'done'
type Mark = 'waiting' | 'writing' | 'done' | 'failed'

const listen = async (tuning: Tuning, system: string, turns: Parameters<typeof speak>[2], signal: AbortSignal, onPiece?: (text: string) => void) => {
  let text = ''
  for await (const piece of speak(tuning, system, turns, signal)) {
    text += piece
    onPiece?.(text)
  }
  return text
}

// A brief becomes a plan, and a plan becomes files. The writer approves the plan
// before anything is written, and every file lands in the open folder as it is
// finished, so stopping halfway still leaves the finished ones behind.
export function Brief({ tuning, system, canFile, onFile, onOpenFolder, onBusy, onBack }: Props) {
  const [step, setStep] = useState<Step>('brief')
  const [brief, setBrief] = useState('')
  const [pieces, setPieces] = useState<Piece[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [written, setWritten] = useState<(string | undefined)[]>([])
  const [live, setLive] = useState(0)
  const [error, setError] = useState('')
  const stop = useRef<AbortController | null>(null)

  useEffect(() => () => stop.current?.abort(), [])

  const plan = async () => {
    if (!brief.trim()) return
    const control = new AbortController()
    stop.current = control
    setError('')
    setStep('planning')
    onBusy('planning')
    try {
      setPieces(readPlan(await listen(tuning, system, planTurns(brief.trim()), control.signal)))
      setStep('plan')
    } catch (e) {
      if (!control.signal.aborted) setError(e instanceof Error ? e.message : String(e))
      setStep('brief')
    } finally {
      onBusy(null)
    }
  }

  const write = async () => {
    const control = new AbortController()
    stop.current = control
    const todo = pieces
    setMarks(todo.map(() => 'waiting'))
    setWritten([])
    setError('')
    setStep('writing')
    for (let i = 0; i < todo.length; i++) {
      if (control.signal.aborted) break
      setMarks((m) => m.map((x, j) => (j === i ? 'writing' : x)))
      setLive(0)
      onBusy(`${i + 1}/${todo.length}`)
      try {
        const text = await listen(tuning, system, pieceTurns(brief.trim(), todo, todo[i]), control.signal, (t) => setLive(t.length))
        const path = await onFile(todo[i].name, `${text.trim()}\n`)
        setWritten((w) => Object.assign([...w], { [i]: path }))
        setMarks((m) => m.map((x, j) => (j === i ? 'done' : x)))
      } catch (e) {
        if (control.signal.aborted) break
        setError(e instanceof Error ? e.message : String(e))
        setMarks((m) => m.map((x, j) => (j === i ? 'failed' : x)))
      }
    }
    onBusy(null)
    setStep('done')
  }

  const halt = () => {
    stop.current?.abort()
    onBusy(null)
  }

  const reset = () => {
    setStep('brief')
    setPieces([])
    setMarks([])
    setWritten([])
    setError('')
  }

  if (!canFile) {
    return (
      <div className="brief">
        <p className="brief-note">Brief writes files into a folder. Open one first.</p>
        <div className="quill-act">
          <button type="button" className="line-button solid" onClick={onOpenFolder}>
            Open folder
          </button>
          <button type="button" className="quiet-button text" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="brief">
      {step === 'brief' || step === 'planning' ? (
        <form
          className="brief-form"
          onSubmit={(e) => {
            e.preventDefault()
            void plan()
          }}
        >
          <label>
            <span>Brief</span>
            <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={8} disabled={step === 'planning'} />
          </label>
          {error ? <p className="quill-error">{error}</p> : null}
          <div className="quill-act">
            {step === 'planning' ? (
              <>
                <span className="quill-pulse" aria-label="Planning" />
                <button type="button" className="quiet-button text" onClick={halt}>
                  Stop
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="line-button solid" disabled={!brief.trim()}>
                  Plan
                </button>
                <button type="button" className="quiet-button text" onClick={onBack}>
                  Back
                </button>
              </>
            )}
          </div>
        </form>
      ) : (
        <>
          <ol className="brief-list">
            {pieces.map((p, i) => (
              <li key={p.name} className={marks[i] ? `is-${marks[i]}` : undefined}>
                <div>
                  <strong>{p.title}</strong>
                  <span>
                    {written[i] ?? p.name}
                    {marks[i] === 'writing' && live ? ` · ${live.toLocaleString()} chars` : ''}
                  </span>
                </div>
                {step === 'plan' ? (
                  <button type="button" className="quiet-button" aria-label={`Drop ${p.title}`} onClick={() => setPieces((all) => all.filter((_, j) => j !== i))}>
                    <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M3 3l8 8M11 3l-8 8" />
                    </svg>
                  </button>
                ) : (
                  <em>{marks[i]}</em>
                )}
              </li>
            ))}
          </ol>
          {error ? <p className="quill-error">{error}</p> : null}
          <div className="quill-act">
            {step === 'plan' ? (
              <>
                <button type="button" className="line-button solid" onClick={() => void write()} disabled={!pieces.length}>
                  Write {pieces.length} {pieces.length === 1 ? 'file' : 'files'}
                </button>
                <button type="button" className="quiet-button text" onClick={() => setStep('brief')}>
                  Edit brief
                </button>
              </>
            ) : step === 'writing' ? (
              <button type="button" className="quiet-button text" onClick={halt}>
                Stop
              </button>
            ) : (
              <>
                <span className="brief-sum">
                  {written.filter(Boolean).length} of {pieces.length} written
                </span>
                <button type="button" className="quiet-button text" onClick={reset}>
                  New brief
                </button>
                <button type="button" className="quiet-button text" onClick={onBack}>
                  Done
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
