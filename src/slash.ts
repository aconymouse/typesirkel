import { autocompletion, type Completion, type CompletionContext, type CompletionResult, snippet } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { type EditorState, RangeSetBuilder } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate, WidgetType } from '@codemirror/view'

// Typing / opens a small menu of markdown formats. Each entry shows the marks it
// writes, so the menu doubles as a cheat sheet and people learn the syntax by
// using it.

type Format = {
  id: string
  label: string
  marks: string
  also: string[]
  block: boolean
  write: string
}

export const formats: Format[] = [
  { id: 'h1', label: 'Heading 1', marks: '#', also: ['title', 'heading'], block: true, write: '# ${}' },
  { id: 'h2', label: 'Heading 2', marks: '##', also: ['heading', 'section'], block: true, write: '## ${}' },
  { id: 'h3', label: 'Heading 3', marks: '###', also: ['heading', 'subheading'], block: true, write: '### ${}' },
  { id: 'bold', label: 'Bold', marks: '**text**', also: ['strong'], block: false, write: '**${text}**' },
  { id: 'italic', label: 'Italic', marks: '*text*', also: ['emphasis'], block: false, write: '*${text}*' },
  { id: 'strike', label: 'Strikethrough', marks: '~~text~~', also: ['delete'], block: false, write: '~~${text}~~' },
  { id: 'list', label: 'Bulleted list', marks: '-', also: ['bullet', 'ul'], block: true, write: '- ${}' },
  { id: 'numbered', label: 'Numbered list', marks: '1.', also: ['ordered', 'ol'], block: true, write: '1. ${}' },
  { id: 'task', label: 'Task', marks: '- [ ]', also: ['todo', 'checkbox'], block: true, write: '- [ ] ${}' },
  { id: 'quote', label: 'Quote', marks: '>', also: ['blockquote', 'cite'], block: true, write: '> ${}' },
  { id: 'link', label: 'Link', marks: '[text](url)', also: ['url', 'href'], block: false, write: '[${text}](${https://})' },
  { id: 'image', label: 'Image', marks: '![alt](url)', also: ['picture', 'img'], block: false, write: '![${alt}](${https://})' },
  { id: 'code', label: 'Inline code', marks: '`code`', also: ['mono'], block: false, write: '`${code}`' },
  { id: 'codeblock', label: 'Code block', marks: '```', also: ['fence', 'snippet'], block: true, write: '```${ts}\n${}\n```' },
  { id: 'table', label: 'Table', marks: '| a | b |', also: ['grid'], block: true, write: '| ${Name} | ${Value} |\n| --- | --- |\n| ${} |  |' },
  { id: 'divider', label: 'Divider', marks: '---', also: ['rule', 'hr', 'line'], block: true, write: '---\n${}' },
]

const insideCode = (state: EditorState, pos: number) => {
  for (let node: ReturnType<ReturnType<typeof syntaxTree>['resolveInner']> | null = syntaxTree(state).resolveInner(pos, -1); node; node = node.parent) {
    if (/Code|HTML/.test(node.name)) return true
  }
  return false
}

const score = (format: Format, query: string) => {
  if (!query) return 1
  const words = [format.id, format.label.toLowerCase(), ...format.also]
  if (words.some((w) => w === query)) return 4
  if (words.some((w) => w.startsWith(query))) return 3
  if (words.some((w) => w.includes(query))) return 2
  return 0
}

const toOption = (format: Format, boost: number): Completion => ({
  label: format.label,
  detail: format.marks,
  boost,
  apply: (view, _completion, from, to) => {
    const slash = from - 1
    const line = view.state.doc.lineAt(slash)
    const before = view.state.sliceDoc(line.from, slash)
    const lead = format.block && before.trim() ? '\n' : ''
    const start = format.block && !before.trim() ? line.from : slash
    snippet(lead + format.write)(view, { label: format.label }, start, to)
  },
})

const slashSource = (context: CompletionContext): CompletionResult | null => {
  const typed = context.matchBefore(/(?:^|\s)\/[\w-]*$/)
  if (!typed) return null
  const slash = typed.text.lastIndexOf('/') + typed.from
  if (insideCode(context.state, slash)) return null
  const query = context.state.sliceDoc(slash + 1, context.pos).toLowerCase()
  const options = formats
    .map((format, i) => ({ format, rank: score(format, query) * 100 - i }))
    .filter((f) => f.rank > 0)
    .map((f) => toOption(f.format, f.rank))
  if (!options.length) return null
  return { from: slash + 1, options, filter: false }
}

// A faint nudge on the empty line you are on, the way it is in most editors
// that have a slash menu. It disappears as soon as you type.
class Nudge extends WidgetType {
  toDOM() {
    const span = document.createElement('span')
    span.className = 'cm-slash-nudge'
    span.textContent = 'Type / for formats'
    span.setAttribute('aria-hidden', 'true')
    return span
  }
  ignoreEvent() {
    return true
  }
}

const nudgeAt = (view: EditorView): DecorationSet => {
  const builder = new RangeSetBuilder<Decoration>()
  const { state } = view
  const head = state.selection.main
  if (!view.hasFocus || !head.empty || state.doc.length === 0) return builder.finish()
  const line = state.doc.lineAt(head.head)
  if (line.length === 0) builder.add(line.from, line.from, Decoration.widget({ widget: new Nudge(), side: 1 }))
  return builder.finish()
}

const nudge = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet
    constructor(view: EditorView) {
      this.decorations = nudgeAt(view)
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet || update.focusChanged) this.decorations = nudgeAt(update.view)
    }
  },
  { decorations: (plugin) => plugin.decorations },
)

const look = EditorView.theme({
  '.cm-slash-nudge': { color: 'var(--faint)', pointerEvents: 'none', fontStyle: 'normal' },
  '.cm-tooltip.cm-tooltip-autocomplete': {
    border: '1px solid var(--line)',
    borderRadius: '10px',
    background: 'color-mix(in srgb, var(--paper) 88%, transparent)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    boxShadow: '0 14px 40px rgb(0 0 0 / 0.22)',
    padding: '4px',
    fontFamily: 'var(--ui)',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul': { maxHeight: '18.5em', minWidth: '15em', fontFamily: 'var(--ui)' },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li': {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '18px',
    padding: '5px 9px',
    borderRadius: '6px',
    fontSize: '13px',
    lineHeight: '1.4',
    color: 'var(--ink)',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': { background: 'var(--hover)', color: 'var(--ink)' },
  '.cm-completionDetail': { marginLeft: 'auto', fontFamily: 'var(--mono)', fontStyle: 'normal', fontSize: '11.5px', color: 'var(--faint)' },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected] .cm-completionDetail': { color: 'var(--accent)' },
  '.cm-snippetField': { backgroundColor: 'var(--match)', borderRadius: '3px' },
})

export const slash = [autocompletion({ override: [slashSource], icons: false, activateOnTyping: true, closeOnBlur: true }), nudge, look]
