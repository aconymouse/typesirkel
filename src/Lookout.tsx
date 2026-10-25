import './lookout.css'
import { useLayoutEffect, useRef, useState } from 'react'
import type { Heading } from './ink'
import { markPath } from './mark'
import { type Stop, sameStops, useWalker } from './walker'

type Props = {
  headings: Heading[]
  active: number
  onPick: (heading: Heading) => void
  // When it sits inside another panel that already names it, the outline drops its own heading.
  bare?: boolean
}

const step = 14
const gutter = 12

// The trail bends once per change in depth, the way a road follows a hillside.
const trailOf = (stops: Stop[]) =>
  stops.reduce((d, stop, i) => {
    if (i === 0) return `M ${stop.x} ${stop.y}`
    const prev = stops[i - 1]
    if (prev.x === stop.x) return `${d} L ${stop.x} ${stop.y}`
    const bend = Math.min(18, (stop.y - prev.y) / 2)
    return `${d} L ${prev.x} ${stop.y - bend} C ${prev.x} ${stop.y - bend / 2} ${stop.x} ${stop.y - bend / 2} ${stop.x} ${stop.y}`
  }, '')

export function Lookout({ headings, active, onPick, bare = false }: Props) {
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
      const next = items.slice(0, headings.length).map((li, i) => ({ x: gutter + (headings[i].level - shallowest) * step, y: li.offsetTop + li.offsetHeight / 2 }))
      setStops((prev) => (sameStops(prev, next) ? prev : next))
      setSize((prev) => (prev.width === el.offsetWidth && prev.height === el.scrollHeight ? prev : { width: el.offsetWidth, height: el.scrollHeight }))
    }
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [headings, shallowest])

  if (headings.length === 0) {
    return (
      <aside className={bare ? 'lookout bare' : 'lookout'}>
        {bare ? null : <p className="lookout-title">On this page</p>}
        <p className="lookout-empty">No headings yet</p>
      </aside>
    )
  }

  return (
    <aside className={bare ? 'lookout bare' : 'lookout'}>
      {bare ? null : <p className="lookout-title">On this page</p>}
      <div className="lookout-body">
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
            <li key={heading.id} style={{ paddingLeft: gutter + (heading.level - shallowest) * step + 20 }}>
              <button type="button" onClick={() => onPick(heading)} className={i === active ? 'here' : i < active ? 'behind' : undefined} title={heading.text}>
                {heading.text}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
