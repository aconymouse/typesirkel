import { EditorView } from '@codemirror/view'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { freshState, jumpTo, topLine } from './nib'

export type SheetHandle = {
  jump: (line: number) => void
  focus: () => void
}

type Props = {
  docKey: string
  text: string
  onChange: (text: string) => void
  onCursor: (line: number) => void
  onScrollLine: (line: number) => void
}

const hint = 'Start with a heading, or just start.'

export const Sheet = forwardRef<SheetHandle, Props>(function Sheet({ docKey, text, onChange, onCursor, onScrollLine }, ref) {
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
  useEffect(() => {
    if (!host.current) return
    const editor = new EditorView({ state: freshState(text, relay.current, hint), parent: host.current })
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
  }))

  return <div className="sheet" ref={host} />
})
