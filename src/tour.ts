import { acceptCompletion, completionStatus } from '@codemirror/autocomplete'
import { EditorSelection, type Extension, StateField, type Text } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView, WidgetType } from '@codemirror/view'
import { faces } from './quill/faces'
import { formats } from './slash'

// The first note writes itself on a first visit: a short, one-screen tour that
// uses the slash menu the way a person would, then hands over to the + button.
// Two more guides, on connecting an AI and on prompts, write themselves the
// same way when asked for, into notes of their own.

type Step = { type: string; pace?: number } | { slash: string; query: string }

export type Guide = 'welcome' | 'connect' | 'prompts'

const still = '\n\n> Still stuck? Ping Aco at [aconymous.com/chat](https://aconymous.com/chat).\n'

const script: Record<Guide, { file: string; label: string; steps: Step[]; words?: boolean }> = {
  welcome: {
    file: 'First note.md',
    label: 'First note',
    steps: [
      { slash: 'h1', query: 'h1' },
      { type: 'Hello, typeSirkel\n\n' },
      {
        type: "Hi, I'm [Aco](https://aconymous.com) ([Hafidz Nc](https://aconymous.com)). Thanks for giving typeSirkel a try. I built it for writing that stays yours: plain markdown, saved as files on your own disk. It's free and open source, so if it earns a place in your day, a star on [GitHub](https://github.com/aconymouse/typesirkel) helps other writers find it.\n\nType / whenever you forget a mark.\n\n",
        pace: 9,
      },
      { slash: 'h2', query: 'h2' },
      { type: 'Headings become a map\nEvery heading is a stop on the trail in the sidebar.\n\n' },
      { slash: 'quote', query: 'quo' },
      { type: 'Quotes start with a greater-than sign.\n\n' },
      { slash: 'list', query: 'list' },
      { type: '**Bold**, *italic* and [links](https://sirkel.asia) work as you type\n\nYour turn: press + in the sidebar for a new note.\n' },
    ],
  },
  connect: {
    file: 'Connect AI.md',
    label: 'Connect AI',
    words: true,
    steps: [
      {
        type: `# Connect your AI

Quill is the writing assistant inside typeSirkel. It works with the AI you already pay for: you bring your own key, and it stays on your device. The desktop app keeps it in your system keychain. In the browser it lasts until you close the tab, unless you tick **Remember on this device**.

Open Quill with **⌘J** on a Mac or **Ctrl J** on Windows, or click **Quill** at the bottom right.

## Claude

1. Sign in to the [Claude Console](https://platform.claude.com/settings/keys) and open **API keys**.
2. Click **Create key**, give it a name and pick a workspace.
3. In Quill, choose **Anthropic**, paste the key, then pick a model.

## ChatGPT

1. Create a key on the [OpenAI API keys page](https://platform.openai.com/api-keys).
2. In Quill, choose **OpenAI**, paste the key, then pick a model.

## Gemini, Llama and the rest

[OpenRouter](https://openrouter.ai/keys) gives you one key for hundreds of models, Gemini included. Choose **OpenRouter** in Quill and paste it. Any other OpenAI-compatible service works under **Other**: paste its base URL and its key.

## Offline, on your own machine

Install [Ollama](https://ollama.com), run \`ollama pull llama3.2\`, then choose **Ollama** in Quill. No key, and nothing leaves your computer. In the browser, start it with \`OLLAMA_ORIGINS=https://sirkel.asia ollama serve\` so this page is allowed to reach it.${still}`,
      },
    ],
  },
  prompts: {
    file: 'Using prompts.md',
    label: 'Using prompts',
    words: true,
    steps: [
      {
        type: `# Using prompts

Prompts are ready-made instructions for Quill: horror, fantasy, straight news, a rewrite that never touches quotes or names, SEO articles, tutorials and storyboards.

## Find one

Open **Prompts** in the sidebar. The small tag beside it, **EN** for now, switches the shelf between English, Indonesian, Portuguese, Korean, Thai and Chinese.

## Use it

Click a prompt to read it. **Copy** puts it on your clipboard for any AI you like. **Use in Quill** pins it as the style for everything Quill writes, shown as a chip you can clear at any time.

## Try one now

1. Click **Straight news** in the sidebar, then **Use in Quill**.
2. Paste a press release into a new note.
3. Ask Quill to turn it into a news piece.

## Make your own

Every prompt is a plain markdown file in [prompts/ on GitHub](https://github.com/aconymouse/typesirkel/tree/main/prompts). Have a better one? A pull request is welcome.${still}`,
      },
    ],
  },
}

const marksOf = (id: string) => (formats.find((f) => f.id === id)?.write ?? '').replace(/\$\{[^}]*\}/g, '')

const textOf = (guide: Guide) => script[guide].steps.map((s) => ('type' in s ? s.type : marksOf(s.slash))).join('')

export const guides = Object.fromEntries((Object.keys(script) as Guide[]).map((g) => [g, { file: script[g].file, label: script[g].label, text: textOf(g) }])) as Record<
  Guide,
  { file: string; label: string; text: string }
>

export const welcome = guides.welcome.text

// Which guide a note still is, word for word. Once someone edits it, it is
// just their note and the guide buttons step aside.
export const guideIn = (text: string | Text): Guide | null => {
  const length = text.length
  for (const g of Object.keys(guides) as Guide[]) {
    if (guides[g].text.length === length && text.toString() === guides[g].text) return g
  }
  return null
}

const onward = (here: Guide): Guide[] => (['connect', 'prompts'] as Guide[]).filter((g) => g !== here)

// Buttons at the foot of a guide, in the editor and the preview alike.
export const guideButtons = (here: Guide, pick: (guide: Guide) => void) => {
  const row = document.createElement('div')
  row.className = 'guide-actions'
  for (const g of onward(here)) {
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
    label.textContent = guides[g].label
    button.append(label)
    button.addEventListener('mousedown', (event) => event.preventDefault())
    button.addEventListener('click', () => pick(g))
    row.append(button)
  }
  return row
}

class Actions extends WidgetType {
  constructor(
    readonly here: Guide,
    readonly pick: (guide: Guide) => void,
  ) {
    super()
  }
  eq(other: Actions) {
    return other.here === this.here
  }
  toDOM() {
    return guideButtons(this.here, this.pick)
  }
  ignoreEvent() {
    return true
  }
}

export const guideWidget = (pick: (guide: Guide) => void): Extension => {
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

export const playGuide = async (view: EditorView, guide: Guide, signal: AbortSignal) => {
  const { steps, words } = script[guide]
  const text = guides[guide].text
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
