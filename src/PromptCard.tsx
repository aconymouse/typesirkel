import { useEffect, useState } from 'react'
import type { Prompt } from './prompts'

type Props = {
  prompt: Prompt
  onUse: (prompt: Prompt) => void
  onClose: () => void
}

export function PromptCard({ prompt, onUse, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const away = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', away)
    return () => window.removeEventListener('keydown', away)
  }, [onClose])

  const copy = async () => {
    await navigator.clipboard.writeText(prompt.body)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="card-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="card" role="dialog" aria-modal="true" aria-labelledby="card-title">
        <header className="card-head">
          <p className="card-kind">{prompt.category}</p>
          <h2 id="card-title">{prompt.title}</h2>
          {prompt.description ? <p className="card-about">{prompt.description}</p> : null}
          <button type="button" className="quiet-button card-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 3l8 8M11 3l-8 8" />
            </svg>
          </button>
        </header>
        <pre className="card-body">{prompt.body}</pre>
        <footer className="card-foot">
          <button type="button" className="line-button solid" onClick={() => void copy()}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" className="quiet-button text" onClick={() => onUse(prompt)}>
            Use in Quill
          </button>
        </footer>
      </section>
    </div>
  )
}
