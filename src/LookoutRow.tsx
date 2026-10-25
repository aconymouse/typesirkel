import './lookout.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Heading } from './ink'
import { markPath } from './mark'
import { type Stop, sameStops, useWalker } from './walker'

type Props = {
  headings: Heading[]
  active: number
  onPick: (heading: Heading) => void
  label?: string
}

const rise = 4

// The tall outline laid on its side, for screens too narrow to give it a
// column. Same trail, same marker; depth now shows as a small dip in the road
// instead of an indent.
const trailOf = (stops: Stop[]) =>
  stops.reduce((d, stop, i) => {
    if (i === 0) return `M ${stop.x} ${stop.y}`
    const prev = stops[i - 1]
    if (prev.y === stop.y) return `${d} L ${stop.x} ${stop.y}`
    const bend = Math.min(18, (stop.x - prev.x) / 2)
    return `${d} L ${stop.x - bend} ${prev.y} C ${stop.x - bend / 2} ${prev.y} ${stop.x - bend / 2} ${stop.y} ${stop.x} ${stop.y}`
  }, '')

export function LookoutRow({ headings, active, onPick, label = 'On this page' }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const [stops, setStops] = useState<Stop[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })
  const { d, road, walked, marker, tile } = useWalker(stops, trailOf, active)

  const shallowest = headings.reduce((min, h) => Math.min(min, h.level), 6)

  useLayoutEffect(() => {
    const el = list.current
    if (!el) return
    const measure = () => {
      const items = Array.from(el.querySelectorAll<HTMLLIElement>('li'))
      const next = items.slice(0, headings.length).map((li, i) => ({ x: li.offsetLeft + 4, y: 11 + Math.min(headings[i].level - shallowest, 3) * rise }))
      setStops((prev) => (sameStops(prev, next) ? prev : next))
      setSize((prev) => (prev.width === el.scrollWidth && prev.height === el.offsetHeight ? prev : { width: el.scrollWidth, height: el.offsetHeight }))
    }
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [headings, shallowest])

  // The heading you are in stays in view, sliding the row along as you read.
  useEffect(() => {
    const box = track.current
    const li = list.current?.children[Math.max(0, active)] as HTMLElement | undefined
    if (!box || !li) return
    const left = li.offsetLeft
    const right = left + li.offsetWidth
    if (left >= box.scrollLeft + 16 && right <= box.scrollLeft + box.clientWidth - 16) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    box.scrollTo({ left: left - (box.clientWidth - li.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' })
  }, [active, stops])

  if (headings.length === 0) return null

  return (
    <nav className="lookout-row" aria-label={label}>
      <div className="lookout-row-track" ref={track}>
        <div className="lookout-row-body">
          <svg className="lookout-trail" width={size.width} height={size.height} aria-hidden="true">
            <path ref={road} d={d} className="trail-ahead" />
            <path ref={walked} d={d} className="trail-walked" />
            {headings.map((heading, i) =>
              stops[i] ? <circle key={heading.id} cx={stops[i].x} cy={stops[i].y} r={2.6} className={i <= active ? 'stop passed' : 'stop'} /> : null,
            )}
            <g ref={marker} className="marker">
              <g ref={tile}>
                <g className="marker-tile">
                  <rect x={-7.5} y={-7.5} width={15} height={15} rx={3.4} />
                  <path d={markPath} transform="translate(-7.5 -7.5) scale(0.0293)" />
                </g>
              </g>
            </g>
          </svg>
          <ol ref={list}>
            {headings.map((heading, i) => (
              <li key={heading.id}>
                <button type="button" onClick={() => onPick(heading)} className={i === active ? 'here' : i < active ? 'behind' : undefined}>
                  {heading.text}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  )
}
