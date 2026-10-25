import './lookout.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Heading } from './ink'
import { markPath } from './mark'

type Props = {
  headings: Heading[]
  active: number
  onPick: (heading: Heading) => void
  // When it sits inside another panel that already names it, the outline drops its own heading.
  bare?: boolean
}

type Stop = { x: number; y: number }

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

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export function Lookout({ headings, active, onPick, bare = false }: Props) {
  const list = useRef<HTMLOListElement>(null)
  const road = useRef<SVGPathElement>(null)
  const walked = useRef<SVGPathElement>(null)
  const marker = useRef<SVGGElement>(null)
  const tile = useRef<SVGGElement>(null)
  const [stops, setStops] = useState<Stop[]>([])
  const [marks, setMarks] = useState<number[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })
  const at = useRef(0)
  const motion = useRef(0)

  const shallowest = headings.reduce((min, h) => Math.min(min, h.level), 6)

  useLayoutEffect(() => {
    const el = list.current
    if (!el) return
    const measure = () => {
      const items = Array.from(el.querySelectorAll<HTMLLIElement>('li'))
      setStops(items.slice(0, headings.length).map((li, i) => ({ x: gutter + (headings[i].level - shallowest) * step, y: li.offsetTop + li.offsetHeight / 2 })))
      setSize({ width: el.offsetWidth, height: el.scrollHeight })
    }
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [headings, shallowest])

  const d = trailOf(stops)

  // Lengths along the trail where each stop sits. Measured on the real path,
  // so the marker lands exactly on the dots no matter how the trail bends.
  useLayoutEffect(() => {
    const path = road.current
    if (!path || stops.length === 0) return setMarks([])
    const probe = path.cloneNode() as SVGPathElement
    path.parentNode?.appendChild(probe)
    const out = stops.map((_, i) => {
      if (i === 0) return 0
      probe.setAttribute('d', trailOf(stops.slice(0, i + 1)))
      return probe.getTotalLength()
    })
    probe.remove()
    setMarks(out)
  }, [stops])

  // The tile leans into the direction it travels and straightens when it stops.
  const place = (length: number, lean: number) => {
    const path = road.current
    if (!path || !marker.current) return
    const total = path.getTotalLength()
    const point = path.getPointAtLength(Math.min(length, total))
    marker.current.setAttribute('transform', `translate(${point.x} ${point.y})`)
    walked.current?.setAttribute('stroke-dasharray', `${length} ${total + 1}`)
    tile.current?.setAttribute('transform', `rotate(${lean})`)
  }

  useEffect(() => {
    if (marks.length === 0) return
    const target = active < 0 ? 0 : marks[Math.min(active, marks.length - 1)]
    const from = at.current
    if (Math.abs(target - from) < 0.5) return place(target, 0)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lean = target > from ? 8 : -8
    const span = reduced ? 0 : Math.min(620, 260 + Math.abs(target - from) * 1.2)
    const start = performance.now()
    cancelAnimationFrame(motion.current)
    const tick = (now: number) => {
      const t = span ? Math.min(1, (now - start) / span) : 1
      const length = from + (target - from) * ease(t)
      at.current = length
      place(length, t < 1 ? lean * Math.sin(Math.PI * t) : 0)
      if (t < 1) motion.current = requestAnimationFrame(tick)
      else blink()
    }
    motion.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(motion.current)
  }, [active, marks])

  const blink = () => {
    const el = tile.current?.firstElementChild
    if (!el) return
    el.classList.remove('blink')
    void (el as SVGElement).getBoundingClientRect()
    el.classList.add('blink')
  }

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
          <path ref={walked} d={d} className="trail-walked" strokeDasharray={`0 ${size.height * 4}`} />
          {headings.map((heading, i) =>
            stops[i] ? <circle key={heading.id} cx={stops[i].x} cy={stops[i].y} r={2.6} className={i <= active ? 'stop passed' : 'stop'} /> : null,
          )}
          <g ref={marker} className="marker" transform={stops[0] ? `translate(${stops[0].x} ${stops[0].y})` : undefined}>
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
