import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { highlightSelectionMatches, search, searchKeymap } from '@codemirror/search'
import { EditorSelection, EditorState, type Extension } from '@codemirror/state'
import { drawSelection, EditorView, keymap, placeholder, type ViewUpdate } from '@codemirror/view'
import { tags } from '@lezer/highlight'
import { yUndoManagerKeymap } from 'y-codemirror.next'
import type { Passage } from './quill/asks'

export type SheetEvents = {
  onChange: (text: string) => void
  onCursor: (line: number) => void
}

// Colors come from CSS variables, so switching themes never rebuilds the editor.
const paint = HighlightStyle.define([
  { tag: tags.heading1, fontSize: '1.45em', fontWeight: '700', color: 'var(--ink)' },
  { tag: tags.heading2, fontSize: '1.25em', fontWeight: '700', color: 'var(--ink)' },
  { tag: tags.heading3, fontSize: '1.1em', fontWeight: '650', color: 'var(--ink)' },
  { tag: [tags.heading4, tags.heading5, tags.heading6], fontWeight: '650', color: 'var(--ink)' },
  { tag: tags.strong, fontWeight: '700' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: [tags.link, tags.url], color: 'var(--link)' },
  { tag: tags.monospace, fontFamily: 'var(--mono)', color: 'var(--code)' },
  { tag: tags.quote, color: 'var(--muted)', fontStyle: 'italic' },
  { tag: [tags.processingInstruction, tags.meta, tags.contentSeparator], color: 'var(--faint)' },
  { tag: [tags.keyword, tags.operator], color: 'var(--code-keyword)' },
  { tag: [tags.string, tags.special(tags.string)], color: 'var(--code-string)' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--faint)', fontStyle: 'italic' },
  { tag: [tags.number, tags.bool, tags.atom], color: 'var(--code-number)' },
  { tag: [tags.function(tags.variableName), tags.definition(tags.variableName)], color: 'var(--code-function)' },
])

const frame = EditorView.theme({
  '&': { height: '100%', fontSize: 'var(--sheet-size)', color: 'var(--ink)', backgroundColor: 'transparent' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { fontFamily: 'var(--sheet-font)', lineHeight: '1.7', padding: '48px 0 30vh' },
  '.cm-content': { maxWidth: 'var(--measure)', margin: '0 auto', padding: '0 32px', caretColor: 'var(--caret)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--caret)', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: 'var(--selection) !important' },
  '.cm-selectionMatch': { backgroundColor: 'var(--match)' },
  '.cm-placeholder': { color: 'var(--faint)' },
  '.cm-panels': { backgroundColor: 'var(--paper)', color: 'var(--ink)', borderColor: 'var(--line)' },
  '.cm-panel.cm-search input, .cm-panel.cm-search button': { fontFamily: 'var(--ui)', fontSize: '12px' },
})

// Wraps the selection in a pair of markers, or unwraps it when they are already there.
const wrap = (before: string, after = before) => (view: EditorView) => {
  view.dispatch(
    view.state.changeByRange((range) => {
      const text = view.state.sliceDoc(range.from, range.to)
      const outside = view.state.sliceDoc(range.from - before.length, range.to + after.length)
      if (outside === `${before}${text}${after}`) {
        return {
          changes: [
            { from: range.from - before.length, to: range.from, insert: '' },
            { from: range.to, to: range.to + after.length, insert: '' },
          ],
          range: EditorSelection.range(range.from - before.length, range.to - before.length),
        }
      }
      return {
        changes: [
          { from: range.from, insert: before },
          { from: range.to, insert: after },
        ],
        range: EditorSelection.range(range.from + before.length, range.to + before.length),
      }
    }),
  )
  return true
}

const link = (view: EditorView) => {
  view.dispatch(
    view.state.changeByRange((range) => {
      const text = view.state.sliceDoc(range.from, range.to) || 'text'
      const insert = `[${text}](url)`
      const start = range.from + text.length + 3
      return { changes: { from: range.from, to: range.to, insert }, range: EditorSelection.range(start, start + 3) }
    }),
  )
  return true
}

const cursorLine = (update: ViewUpdate) => update.state.doc.lineAt(update.state.selection.main.head).number - 1

// A shared sheet hands undo to Yjs, so you only ever undo your own typing,
// never a sentence someone else just wrote.
export const sheetExtensions = (events: SheetEvents, hint: string, shared?: Extension): Extension[] => [
  shared ?? history(),
  drawSelection(),
  search({ top: true }),
  highlightSelectionMatches(),
  EditorView.lineWrapping,
  EditorState.allowMultipleSelections.of(true),
  markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
  syntaxHighlighting(paint),
  frame,
  placeholder(hint),
  keymap.of([
    { key: 'Mod-b', run: wrap('**') },
    { key: 'Mod-i', run: wrap('*') },
    { key: 'Mod-e', run: wrap('`') },
    { key: 'Mod-k', run: link },
    ...searchKeymap,
    ...(shared ? yUndoManagerKeymap : historyKeymap),
    ...defaultKeymap,
    indentWithTab,
  ]),
  EditorView.updateListener.of((update) => {
    if (update.docChanged) events.onChange(update.state.doc.toString())
    if (update.docChanged || update.selectionSet) events.onCursor(cursorLine(update))
  }),
]

export const freshState = (doc: string, events: SheetEvents, hint: string, shared?: Extension) => EditorState.create({ doc, extensions: sheetExtensions(events, hint, shared) })

export const jumpTo = (view: EditorView, line: number) => {
  const target = view.state.doc.line(Math.min(Math.max(line + 1, 1), view.state.doc.lines))
  view.dispatch({ selection: { anchor: target.from }, effects: EditorView.scrollIntoView(target.from, { y: 'start', yMargin: 48 }) })
  view.focus()
}

// The line sitting at the top edge of the visible sheet.
export const topLine = (view: EditorView) => {
  const rect = view.scrollDOM.getBoundingClientRect()
  const block = view.lineBlockAtHeight(rect.top + 56 - view.documentTop)
  return view.state.doc.lineAt(block.from).number - 1
}

// What the quill works on: the selection, or else the paragraph under the cursor.
export const passage = (view: EditorView): Passage => {
  const { state } = view
  const range = state.selection.main
  const whole = state.doc.toString()
  if (!range.empty) return { from: range.from, to: range.to, text: state.sliceDoc(range.from, range.to), before: state.sliceDoc(0, range.to), whole }
  let start = state.doc.lineAt(range.head)
  if (!start.text.trim()) return { from: range.head, to: range.head, text: '', before: state.sliceDoc(0, range.head), whole }
  let end = start
  while (start.number > 1 && state.doc.line(start.number - 1).text.trim()) start = state.doc.line(start.number - 1)
  while (end.number < state.doc.lines && state.doc.line(end.number + 1).text.trim()) end = state.doc.line(end.number + 1)
  return { from: start.from, to: end.to, text: state.sliceDoc(start.from, end.to), before: state.sliceDoc(0, end.to), whole }
}

// The draft may have moved while the model was talking, especially on a shared
// sheet. If the passage is no longer where we left it, the answer goes to the
// cursor instead of overwriting someone else's words.
export const land = (view: EditorView, from: Passage, answer: string, how: 'replace' | 'after') => {
  const text = answer.trim()
  const intact = view.state.sliceDoc(from.from, from.to) === from.text
  const head = view.state.selection.main.head
  const change =
    how === 'replace' && intact && from.text
      ? { from: from.from, to: from.to, insert: text }
      : intact && from.text
        ? { from: from.to, insert: `\n\n${text}` }
        : { from: head, insert: text }
  const start = change.from + (change.insert.length - text.length)
  view.dispatch({
    changes: change,
    selection: EditorSelection.range(start, start + text.length),
    effects: EditorView.scrollIntoView(start, { y: 'center' }),
  })
  view.focus()
}

// Brings the sheet in line with a newer copy from disk by touching only the
// part that differs, so the cursor and undo history mostly survive.
export const refill = (view: EditorView, next: string) => {
  const prev = view.state.doc.toString()
  if (prev === next) return
  let start = 0
  while (start < prev.length && start < next.length && prev[start] === next[start]) start++
  let endPrev = prev.length
  let endNext = next.length
  while (endPrev > start && endNext > start && prev[endPrev - 1] === next[endNext - 1]) {
    endPrev--
    endNext--
  }
  view.dispatch({ changes: { from: start, to: endPrev, insert: next.slice(start, endNext) } })
}
