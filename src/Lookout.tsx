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

const same = (a: number[], b: number[]) => a.length === b.length && a.every((n, i) => Math.abs(n - b[i]) < 0.5)
const sameStops = (a: Stop[], b: Stop[]) => same(a.flatMap((s) => [s.x, s.y]), b.flatMap((s) => [s.x, s.y]))

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
  const speed = useRef(0)
  const goal = useRef(0)
  const motion = useRef(0)

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

  const d = trailOf(stops)

  // Lengths along the trail where each stop sits. Measured on the real path,
  // so the marker lands exactly on the dots no matter how the trail bends.
  useLayoutEffect(() => {
    const path = road.current
    if (!path || stops.length === 0) return setMarks((prev) => (prev.length ? [] : prev))
    const probe = path.cloneNode() as SVGPathElement
    path.parentNode?.appendChild(probe)
    const out = stops.map((_, i) => {
      if (i === 0) return 0
      probe.setAttribute('d', trailOf(stops.slice(0, i + 1)))
      return probe.getTotalLength()
    })
    probe.remove()
    setMarks((prev) => (same(prev, out) ? prev : out))
  }, [stops])

  // The tile leans into the direction it travels and straightens when it stops.
  const place = (length: number, lean: number) => {
    const path = road.current
    if (!path || !marker.current) return
    const total = path.getTotalLength()
    const point = path.getPointAtLength(Math.min(length, total))
    marker.current.setAttribute('transform', `translate(${point.x} ${point.y})`)
    walked.current?.style.setProperty('stroke-dasharray', `${length} ${total + 1}`)
    tile.current?.setAttribute('transform', `rotate(${lean})`)
  }

  // A spring, not a timeline. While a guide types heading after heading the
  // goal keeps moving, and a spring simply bends toward the new goal from
  // wherever it is, at the speed it already has, instead of starting over.
  const glide = () => {
    if (motion.current) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const pull = 15
      const gap = goal.current - at.current
      speed.current += (pull * pull * gap - 2 * pull * speed.current) * dt
      at.current += speed.current * dt
      const settled = Math.abs(gap) < 0.3 && Math.abs(speed.current) < 4
      if (settled) {
        at.current = goal.current
        speed.current = 0
        motion.current = 0
        place(at.current, 0)
        blink()
        return
      }
      place(at.current, Math.max(-9, Math.min(9, speed.current * 0.05)))
      motion.current = requestAnimationFrame(tick)
    }
    motion.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (marks.length === 0) return
    goal.current = active < 0 ? 0 : marks[Math.min(active, marks.length - 1)]
    if (motion.current) return
    if (Math.abs(goal.current - at.current) < 0.5 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      at.current = goal.current
      return place(at.current, 0)
    }
    glide()
  }, [active, marks, d])

  useEffect(
    () => () => {
      cancelAnimationFrame(motion.current)
      motion.current = 0
    },
    [],
  )

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
