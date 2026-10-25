import '../proof.css'
import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { counts, ink } from '../ink'
import { Lookout } from '../Lookout'
import { Proof, type ProofHandle } from '../Proof'
import { Sheet, type SheetHandle } from '../Sheet'

// Three small notes, so the shelf has something to switch between. Nothing here
// is saved; the demo forgets everything when the page closes.
const drafts = [
  {
    name: 'essay.md',
    text: `# Notes on writing in folders

Every draft starts as a single file. A folder is just a shelf you can carry around.

## Why plain files

A \`.md\` file opens in anything, survives every app you will ever switch to, and diffs nicely in git.

### What you lose

Nothing worth keeping. No accounts, no export button, no lock-in.

## How the lookout helps

Long drafts get lost in the middle. The eye on the right always knows which section you are in.

### Try it

Scroll this note, or click a heading on the right.

## Next

Type anything here. The preview and the outline follow along.
`,
  },
  {
    name: 'trip.md',
    text: `# Lisbon, three days

## Day one

Arrive early, coffee at the corner place, then the long walk up to the castle.

## Day two

Tram 28 before the crowds. Lunch by the river.

### Pack

- Light jacket
- Good shoes
- The small notebook

## Day three

Nothing planned. That is the plan.
`,
  },
  {
    name: 'ideas.md',
    text: `# Ideas

## For the newsletter

- A week of writing only in the morning
- What a folder of notes looks like after a year

## For later

> Write the thing you wish you could read.

**Bold** and *italic* work the way you expect.
`,
  },
]

type Mode = 'write' | 'split' | 'read'

export default function LiveDemo() {
  const [index, setIndex] = useState(0)
  const [texts, setTexts] = useState(() => drafts.map((d) => d.text))
  const [mode, setMode] = useState<Mode>('split')
  const [focusLine, setFocusLine] = useState(0)
  const sheet = useRef<SheetHandle>(null)
  const proof = useRef<ProofHandle>(null)

  const text = texts[index]
  const deferred = useDeferredValue(text)
  const inked = useMemo(() => ink(deferred), [deferred])
  const tally = useMemo(() => counts(deferred), [deferred])
  // The preview sits inside a page that has its own headings. Keeping the demo's
  // out of the document outline leaves the landing page's hierarchy intact.
  const html = useMemo(() => inked.html.replace(/<(\/?)h([1-6])\b/g, (_, close: string, level: string) => (close ? '</div' : `<div data-h="${level}"`)), [inked.html])

  const active = useMemo(() => {
    let found = -1
    inked.headings.forEach((h, i) => {
      if (h.line <= focusLine) found = i
    })
    return found
  }, [inked.headings, focusLine])

  const change = (value: string) => setTexts((all) => all.map((t, i) => (i === index ? value : t)))

  const open = (i: number) => {
    setIndex(i)
    setFocusLine(0)
  }

  return (
    <div className={`demo demo-${mode}`}>
      <nav className="demo-shelf" aria-label="Demo files">
        <p className="demo-folder">notes</p>
        {drafts.map((d, i) => (
          <button key={d.name} type="button" className={i === index ? 'here' : undefined} onClick={() => open(i)}>
            {d.name.replace(/\.md$/, '')}
          </button>
        ))}
      </nav>

      <div className="demo-panes">
        <div className="demo-sheet" hidden={mode === 'read'}>
          <Sheet
            ref={sheet}
            docKey={drafts[index].name}
            text={text}
            onChange={change}
            onCursor={(line) => {
              setFocusLine(line)
              if (mode === 'split') proof.current?.showLine(line)
            }}
            onScrollLine={(line) => mode === 'split' && proof.current?.showLine(line)}
          />
        </div>
        <div className="demo-proof" hidden={mode === 'write'}>
          <Proof ref={proof} html={html} onScrollLine={setFocusLine} />
        </div>
      </div>

      <div className="demo-lookout">
        <Lookout
          headings={inked.headings}
          active={active}
          onPick={(h) => {
            setFocusLine(h.line)
            if (mode !== 'read') sheet.current?.jump(h.line)
            if (mode !== 'write') proof.current?.showId(h.id)
          }}
        />
      </div>

      <div className="demo-bar">
        <span className="demo-saved">Saved</span>
        <span className="demo-path">notes/{drafts[index].name}</span>
        <span className="demo-count">{tally.words} words</span>
        <span className="demo-modes" role="group" aria-label="View">
          {(['write', 'split', 'read'] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m}
            </button>
          ))}
        </span>
      </div>
    </div>
  )
}
