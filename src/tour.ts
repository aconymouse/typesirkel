import { acceptCompletion, completionStatus } from '@codemirror/autocomplete'
import { EditorSelection, type Extension, StateField, type Text } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView, WidgetType } from '@codemirror/view'
import { type Guide, type Script, scriptFor } from './guides'
import { type Lang, langs } from './lang'
import { faces } from './quill/faces'
import { formats } from './slash'

export type { Guide } from './guides'

// The first note writes itself on a first visit: a short, one-screen tour that
// uses the slash menu the way a person would, then hands over to the + button.
// Two more guides, on connecting an AI and on prompts, write themselves the
// same way when asked for, into notes of their own, in the reader's language.

const marksOf = (id: string) => (formats.find((f) => f.id === id)?.write ?? '').replace(/\$\{[^}]*\}/g, '')

const textOf = (script: Script) => script.steps.map((s) => ('type' in s ? s.type : marksOf(s.slash))).join('')

const all = (['welcome', 'connect', 'prompts'] as Guide[]).flatMap((guide) =>
  langs.map(({ id }) => {
    const script = scriptFor(guide, id)
    return { guide, lang: id, script, text: textOf(script) }
  }),
)

export const guideOf = (guide: Guide, lang: Lang) => all.find((g) => g.guide === guide && g.lang === lang) ?? all[0]

export const welcomeIn = (lang: Lang) => guideOf('welcome', lang).text

// Which guide a note still is, word for word. Once someone edits it, it is
// just their note and the guide buttons step aside.
export type Found = { guide: Guide; lang: Lang }

export const guideIn = (text: string | Text): Found | null => {
  const length = text.length
  for (const g of all) {
    if (g.text.length === length && text.toString() === g.text) return { guide: g.guide, lang: g.lang }
  }
  return null
}

const onward = (here: Guide): Guide[] => (['connect', 'prompts'] as Guide[]).filter((g) => g !== here)

// Buttons at the foot of a guide, in the editor and the preview alike.
export const guideButtons = (here: Found, pick: (guide: Guide, lang: Lang) => void) => {
  const row = document.createElement('div')
  row.className = 'guide-actions'
  for (const g of onward(here.guide)) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `guide-button is-${g}`
    if (g === 'connect') {
      const stack = document.createElement('span')
      stack.className = 'quill-faces'
      stack.setAttribute('aria-hidden', 'true')
      for (const face of faces) {
        const dot = document.createElement('span')
        dot.className = `quill-face is-${face.name.toLowerCase()}`
        dot.innerHTML = `<svg viewBox="0 0 24 24" width="10" height="10"><path d="${face.path}"/></svg>`
        stack.append(dot)
      }
      button.append(stack)
    }
    const label = document.createElement('span')
    label.textContent = guideOf(g, here.lang).script.label
    button.append(label)
    button.addEventListener('mousedown', (event) => event.preventDefault())
    button.addEventListener('click', () => pick(g, here.lang))
    row.append(button)
  }
  return row
}

class Actions extends WidgetType {
  constructor(
    readonly here: Found,
    readonly pick: (guide: Guide, lang: Lang) => void,
  ) {
    super()
  }
  eq(other: Actions) {
    return other.here.guide === this.here.guide && other.here.lang === this.here.lang
  }
  toDOM() {
    return guideButtons(this.here, this.pick)
  }
  ignoreEvent() {
    return true
  }
}

export const guideWidget = (pick: (guide: Guide, lang: Lang) => void): Extension => {
  const build = (doc: Text): DecorationSet => {
    const here = guideIn(doc)
    return here ? Decoration.set([Decoration.widget({ widget: new Actions(here, pick), block: true, side: 1 }).range(doc.length)]) : Decoration.none
  }
  return StateField.define<DecorationSet>({
    create: (state) => build(state.doc),
    update: (value, tr) => (tr.docChanged ? build(tr.state.doc) : value),
    provide: (field) => EditorView.decorations.from(field),
  })
}

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason)
    const timer = window.setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })

const put = (view: EditorView, text: string, userEvent: string) => {
  const at = view.state.selection.main.head
  view.dispatch({ changes: { from: at, insert: text }, selection: EditorSelection.cursor(at + text.length), userEvent, scrollIntoView: true })
}

// Typed, not pasted: a little faster on letters, a beat longer after a sentence.
const typeOut = async (view: EditorView, text: string, signal: AbortSignal, userEvent = 'input', pace = 16) => {
  for (const char of text) {
    put(view, char, userEvent)
    await wait(char === '\n' ? 140 : /[.,:]/.test(char) ? pace * 6 : pace + Math.random() * pace, signal)
  }
}

// Longer guides are read rather than watched, so they arrive a word at a time.
const wordOut = async (view: EditorView, text: string, signal: AbortSignal) => {
  for (const piece of text.split(/(?<=\s)/)) {
    put(view, piece, 'input')
    await wait(piece.endsWith('\n') ? 70 : 16 + Math.random() * 14, signal)
  }
}

const menuShows = async (view: EditorView, signal: AbortSignal) => {
  for (let tries = 0; tries < 40 && completionStatus(view.state) !== 'active'; tries++) await wait(25, signal)
  return completionStatus(view.state) === 'active'
}

const finish = (view: EditorView, text: string) => {
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text }, selection: EditorSelection.cursor(text.length) })
}

export const playGuide = async (view: EditorView, guide: Guide, lang: Lang, signal: AbortSignal) => {
  const { script, text } = guideOf(guide, lang)
  const { steps, words } = script
  const stop = new AbortController()
  const takeOver = () => stop.abort('taken over')
  const quit = () => stop.abort('gone')
  const watched = [view.dom, document.querySelector('.proof')].filter((el): el is Element => !!el)
  signal.addEventListener('abort', quit, { once: true })
  for (const el of watched) {
    el.addEventListener('pointerdown', takeOver, { once: true })
    el.addEventListener('keydown', takeOver, { once: true })
  }

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) throw new Error('still')
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: '' } })
    await wait(words ? 250 : 500, stop.signal)
    for (const step of steps) {
      if ('type' in step) {
        await (words ? wordOut(view, step.type, stop.signal) : typeOut(view, step.type, stop.signal, 'input', step.pace))
        continue
      }
      await typeOut(view, `/${step.query}`, stop.signal, 'input.type')
      if (!(await menuShows(view, stop.signal))) throw new Error('no menu')
      await wait(650, stop.signal)
      acceptCompletion(view)
      await wait(220, stop.signal)
    }
    if (view.state.doc.toString() !== text) finish(view, text)
  } catch {
    if (stop.signal.reason !== 'gone') finish(view, text)
  } finally {
    for (const el of watched) {
      el.removeEventListener('pointerdown', takeOver)
      el.removeEventListener('keydown', takeOver)
    }
    signal.removeEventListener('abort', quit)
  }
}
