import { acceptCompletion, completionStatus } from '@codemirror/autocomplete'
import { EditorSelection } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { formats } from './slash'

// The first note writes itself on a first visit: a short, one-screen tour that
// uses the slash menu the way a person would, then hands over to the + button.

type Step = { type: string } | { slash: string; query: string }

const steps: Step[] = [
  { slash: 'h1', query: 'h1' },
  { type: 'Hello, typeSirkel\n\nPlain markdown, saved as files. Type / whenever you forget a mark.\n\n' },
  { slash: 'h2', query: 'h2' },
  { type: 'Headings become a map\nEvery heading is a stop on the trail in the sidebar.\n\n' },
  { slash: 'quote', query: 'quo' },
  { type: 'Quotes start with a greater-than sign.\n\n' },
  { slash: 'list', query: 'list' },
  { type: 'Lists start with a dash\n- **Bold**, *italic* and [links](https://sirkel.asia) work as you type\n\nYour turn: press + in the sidebar for a new note.\n' },
]

const marksOf = (id: string) => (formats.find((f) => f.id === id)?.write ?? '').replace(/\$\{[^}]*\}/g, '')

export const welcome = steps.map((s) => ('type' in s ? s.type : marksOf(s.slash))).join('')

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason)
    const timer = window.setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(signal.reason)
    }, { once: true })
  })

const put = (view: EditorView, text: string, userEvent: string) => {
  const at = view.state.selection.main.head
  view.dispatch({ changes: { from: at, insert: text }, selection: EditorSelection.cursor(at + text.length), userEvent, scrollIntoView: true })
}

// Typed, not pasted: a little faster on letters, a beat longer after a sentence.
const typeOut = async (view: EditorView, text: string, signal: AbortSignal, userEvent = 'input') => {
  for (const char of text) {
    put(view, char, userEvent)
    await wait(char === '\n' ? 140 : /[.,:]/.test(char) ? 120 : 16 + Math.random() * 18, signal)
  }
}

const menuShows = async (view: EditorView, signal: AbortSignal) => {
  for (let tries = 0; tries < 40 && completionStatus(view.state) !== 'active'; tries++) await wait(25, signal)
  return completionStatus(view.state) === 'active'
}

const finish = (view: EditorView) => {
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: welcome }, selection: EditorSelection.cursor(welcome.length) })
}

export const playTour = async (view: EditorView, signal: AbortSignal) => {
  const stop = new AbortController()
  const takeOver = () => stop.abort('taken over')
  const quit = () => stop.abort('gone')
  signal.addEventListener('abort', quit, { once: true })
  view.dom.addEventListener('pointerdown', takeOver, { once: true })
  view.dom.addEventListener('keydown', takeOver, { once: true })

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) throw new Error('still')
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: '' } })
    await wait(500, stop.signal)
    for (const step of steps) {
      if ('type' in step) {
        await typeOut(view, step.type, stop.signal)
        continue
      }
      await typeOut(view, `/${step.query}`, stop.signal, 'input.type')
      if (!(await menuShows(view, stop.signal))) throw new Error('no menu')
      await wait(650, stop.signal)
      acceptCompletion(view)
      await wait(220, stop.signal)
    }
    if (view.state.doc.toString() !== welcome) finish(view)
  } catch {
    if (stop.signal.reason !== 'gone') finish(view)
  } finally {
    view.dom.removeEventListener('pointerdown', takeOver)
    view.dom.removeEventListener('keydown', takeOver)
    signal.removeEventListener('abort', quit)
  }
}
