import './proof.css'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { onDesktop } from './drawer/tauri'

export type ProofHandle = {
  showLine: (line: number, smooth?: boolean) => void
  showId: (id: string) => void
}

type Props = {
  html: string
  onScrollLine: (line: number) => void
}

const marked = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>('[data-line]'))

const openOutside = async (href: string) => {
  if (onDesktop()) {
    const { openUrl } = await import('@tauri-apps/plugin-opener')
    await openUrl(href)
  } else {
    window.open(href, '_blank', 'noopener,noreferrer')
  }
}

export const Proof = forwardRef<ProofHandle, Props>(function Proof({ html, onScrollLine }, ref) {
  const scroller = useRef<HTMLDivElement>(null)
  const page = useRef<HTMLElement>(null)
  const quiet = useRef(0)
  const report = useRef(onScrollLine)
  report.current = onScrollLine

  useImperativeHandle(ref, () => ({
    showLine(line, smooth = false) {
      const box = scroller.current
      const root = page.current
      if (!box || !root) return
      let target: HTMLElement | null = null
      for (const el of marked(root)) {
        if (Number(el.dataset.line) <= line) target = el
        else break
      }
      // Programmatic scrolls should not echo back as if the reader moved.
      quiet.current = performance.now() + 400
      box.scrollTo({ top: target ? target.offsetTop - 32 : 0, behavior: smooth ? 'smooth' : 'auto' })
    },
    showId(id) {
      const el = page.current?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
      if (!el || !scroller.current) return
      quiet.current = performance.now() + 700
      scroller.current.scrollTo({ top: el.offsetTop - 32, behavior: 'smooth' })
    },
  }))

  useEffect(() => {
    const box = scroller.current
    const root = page.current
    if (!box || !root) return
    let frame = 0
    const scrolled = () => {
      if (performance.now() < quiet.current) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const edge = box.scrollTop + 48
        let line = 0
        for (const el of marked(root)) {
          if (el.offsetTop <= edge) line = Number(el.dataset.line)
          else break
        }
        report.current(line)
      })
    }
    box.addEventListener('scroll', scrolled, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      box.removeEventListener('scroll', scrolled)
    }
  }, [])

  const follow = (event: React.MouseEvent) => {
    const anchor = (event.target as HTMLElement).closest('a')
    const href = anchor?.getAttribute('href')
    if (!href) return
    event.preventDefault()
    if (href.startsWith('#')) {
      const el = page.current?.querySelector<HTMLElement>(`#${CSS.escape(decodeURIComponent(href.slice(1)))}`)
      if (el && scroller.current) scroller.current.scrollTo({ top: el.offsetTop - 32, behavior: 'smooth' })
      return
    }
    if (/^(https?:|mailto:)/i.test(href)) void openOutside(href)
  }

  return (
    <div className="proof" ref={scroller}>
      <article className="proof-page" ref={page} onClick={follow} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})
