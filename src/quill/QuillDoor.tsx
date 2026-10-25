import { faces } from './faces'

const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

// The way into Quill from the bar: a small stack of provider marks that fans
// out on hover, the name, and the shortcut, so nobody has to guess it exists.
export function QuillDoor({ open, busy, onToggle }: { open: boolean; busy: string | null; onToggle: () => void }) {
  const keys = mac ? '⌘J' : 'Ctrl J'
  return (
    <button type="button" className="quill-door" aria-pressed={open} onClick={onToggle} title={`Quill (${keys})`}>
      <span className="quill-faces" aria-hidden="true">
        {faces.map((face) => (
          <span key={face.name} className={`quill-face is-${face.name.toLowerCase()}`}>
            <svg viewBox="0 0 24 24" width="10" height="10">
              <path d={face.path} />
            </svg>
          </span>
        ))}
      </span>
      <span>{busy ? `Quill ${busy}` : 'Quill'}</span>
      <kbd>{keys}</kbd>
    </button>
  )
}
