import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Passage } from './quill/asks'
import { freshState, jumpTo, land, passage, refill, topLine } from './nib'

export type SheetHandle = {
  jump: (line: number) => void
  focus: () => void
  passage: () => Passage | null
  land: (from: Passage, answer: string, how: 'replace' | 'after') => void
  refill: (text: string) => void
}

type Props = {
  docKey: string
  text: string
  shared?: Extension
  onChange: (text: string) => void
  onCursor: (line: number) => void
  onScrollLine: (line: number) => void
}

const hint = 'Start with a heading, or just start.'

export const Sheet = forwardRef<SheetHandle, Props>(function Sheet({ docKey, text, shared, onChange, onCursor, onScrollLine }, ref) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const events = useRef({ onChange, onCursor, onScrollLine })
  events.current = { onChange, onCursor, onScrollLine }

  // Callbacks are read through a ref, so the editor is built once per document
  // and typing never fights React for the cursor.
  const relay = useRef({
    onChange: (value: string) => events.current.onChange(value),
    onCursor: (line: number) => events.current.onCursor(line),
  })

  // A new document gets a new editor. Undo history belongs to the file it was made in.
  // Joining or leaving a circle also changes the key, since the sheet is wired differently.
  useEffect(() => {
    if (!host.current) return
    const editor = new EditorView({ state: freshState(text, relay.current, hint, shared), parent: host.current })
    view.current = editor
    let frame = 0
    const scrolled = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => events.current.onScrollLine(topLine(editor)))
    }
    editor.scrollDOM.addEventListener('scroll', scrolled, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      editor.scrollDOM.removeEventListener('scroll', scrolled)
      editor.destroy()
      view.current = null
    }
  }, [docKey])

  useImperativeHandle(ref, () => ({
    jump: (line) => view.current && jumpTo(view.current, line),
    focus: () => view.current?.focus(),
    passage: () => (view.current ? passage(view.current) : null),
    land: (from, answer, how) => view.current && land(view.current, from, answer, how),
    refill: (next) => view.current && refill(view.current, next),
  }))

  return <div className="sheet" ref={host} />
})
